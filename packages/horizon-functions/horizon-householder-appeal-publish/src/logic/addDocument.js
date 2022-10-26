const axios = require('axios');
const { appealDocumentTypes } = require('./documentTypes');

const config = {
	documents: {
		url: process.env.DOCUMENT_SERVICE_URL
	},
	horizon: {
		url: process.env.HORIZON_URL
	}
};

// body.documentType is tested instead of passing in a new 'is this an appeal or reply' parameter
// from packages/horizon-householder-appeal-publish/src/publishDocuments.js.
// This is because doing so breaks the tests for horizon-householder-appeal-publish
const isAppeal = (documentType) => {
	return Object.values(appealDocumentTypes).indexOf(documentType) > -1;
};

function getHorizonDocumentXmlInJsonFormat(documentData, body) {
	//TODO: remove 'log' parameter when AS-5031 is complete
	const documentInvolvementName = body.documentInvolvement || 'Document:Involvement';
	const documentGroupTypeName = body.documentGroupType || 'Document:Document Group Type';
	const documentInvolvementValue = isAppeal(body.documentType) ? 'Appellant' : 'LPA';

	/**
	 * TODO: When the AS-5031 feature flag is removed remove the if statement
	 * and the lines above it below
	 *
	 * We're using a check on these values being truthy here to prevent misalignment
	 * on feature flag settings between apps. Since we cache feature flag configs,
	 * we should try to only use the flag in one app so that we don't have two caches
	 * in two apps, which can cause obvious issues! So, the `horizon_document_type`
	 * and `horizon_document_group_type` on `documentData` below should only be set
	 * if the AS-5031 feature flag is on :) By doing this check we avoid the need to
	 * do a feature flag check across two separate services! If they're not set, we
	 * fall back to the way the `documentTypeValue` and `documentGroupTypeValue` values
	 * were set previously!
	 *
	 * Also note that we have to remove those fields from `documentData` since, if we don't,
	 * they're included in the `a:Content` node below, and this causes Horizon to not upload
	 * the document since the schema isn't correct ¯\_(ツ)_/¯ (it was like this before we got
	 * here)
	 */
	let documentTypeValue = body.documentType;
	let documentGroupTypeValue = isAppeal(body.documentType) ? 'Initial Documents' : 'Evidence';

	if (documentData?.horizon_document_type && documentData?.horizon_document_group_type) {
		documentTypeValue = documentData.horizon_document_type;
		documentGroupTypeValue = documentData.horizon_document_group_type;
		delete documentData['horizon_document_type'];
		delete documentData['horizon_document_group_type'];
	}

	const horizonDocumentXmlInJsonFormat = {
		// The order of this object is important
		'a:HorizonAPIDocument': {
			'a:Content': documentData,
			'a:DocumentType': documentTypeValue,
			'a:Filename': documentData.name,
			'a:IsPublished': 'false',
			'a:Metadata': {
				'a:Attributes': [
					{
						'a:AttributeValue': {
							'__i:type': 'a:StringAttributeValue',
							'a:Name': documentInvolvementName,
							'a:Value': documentInvolvementValue
						}
					},
					{
						'a:AttributeValue': {
							'__i:type': 'a:StringAttributeValue',
							'a:Name': documentGroupTypeName,
							'a:Value': documentGroupTypeValue
						}
					},
					{
						'a:AttributeValue': {
							'__i:type': 'a:StringAttributeValue',
							'a:Name': 'Document:Incoming/Outgoing/Internal',
							'a:Value': 'Incoming'
						}
					},
					{
						'a:AttributeValue': {
							'__i:type': 'a:DateAttributeValue',
							'a:Name': 'Document:Received/Sent Date',
							'a:Value': documentData?.upload_date
						}
					}
				]
			},
			'a:NodeId': '0'
		}
	};

	return horizonDocumentXmlInJsonFormat;
}

async function downloadDocumentFromDocumentsApi({ body }) {
	const { documentId, applicationId } = body;

	return await axios.get(`/api/v1/${applicationId}/${documentId}/file`, {
		baseURL: config.documents.url,
		params: {
			base64: true
		}
	});
}

module.exports = async (log, body) => {
	log('Receiving add document request');

	try {
		const { caseReference } = body;

		const document = await downloadDocumentFromDocumentsApi({ body });
		const horizonDocumentXmlInJsonFormat = getHorizonDocumentXmlInJsonFormat(
			document.data,
			body,
			log
		);

		const input = {
			AddDocuments: {
				__soap_op: 'http://tempuri.org/IHorizon/AddDocuments',
				__xmlns: 'http://tempuri.org/',
				caseReference,
				documents: [
					{ '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business' },
					{ '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance' },
					horizonDocumentXmlInJsonFormat
				]
			}
		};

		log(JSON.stringify(input), 'Uploading documents to Horizon');

		const { data } = await axios.post('/horizon', input, {
			baseURL: config.horizon.url,
			/* Needs to be infinity as Horizon doesn't support multipart uploads */
			maxBodyLength: Infinity
		});

		return {
			caseReference,
			data
		};
	} catch (err) {
		log(err, 'Error');
		let message;

		/* istanbul ignore else */
		if (err.response) {
			message = err.message;
		} else if (err.request) {
			message = err.message;
			log(message);
		} else {
			message = 'General error';
			log(
				{
					message: err?.message,
					stack: err?.stack
				},
				message
			);
		}

		return {
			message
		};
	}
};

module.exports.createDataObject = getHorizonDocumentXmlInJsonFormat;
