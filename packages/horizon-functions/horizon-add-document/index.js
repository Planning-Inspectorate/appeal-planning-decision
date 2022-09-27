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

function createDataObject(data, body) {
	const documentInvolvementName = body.documentInvolvement || 'Document:Involvement';
	const documentGroupTypeName = body.documentGroupType || 'Document:Document Group Type';
	const documentInvolvementValue = isAppeal(body.documentType) ? 'Appellant' : 'LPA';
	const documentGroupTypeValue = body.documentGroupTypeValue || 'Evidence';
	return {
		// The order of this object is important
		'a:HorizonAPIDocument': {
			'a:Content': data.data,
			'a:DocumentType': body.documentType,
			'a:Filename': data.name,
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
							'a:Value': data.createdAt
						}
					}
				]
			},
			'a:NodeId': '0'
		}
	};
}

async function parseFile({ body }) {
	const { documentId, applicationId } = body;

	const { data } = await axios.get(`/api/v1/${applicationId}/${documentId}/file`, {
		baseURL: config.documents.url,
		params: {
			base64: true
		}
	});

	const object = createDataObject(data, body);

	return object;
}

module.exports = async (context, req) => {
	context.log('Receiving add document request');

	try {
		const { caseReference } = req.body;

		const input = {
			AddDocuments: {
				__soap_op: 'http://tempuri.org/IHorizon/AddDocuments',
				__xmlns: 'http://tempuri.org/',
				caseReference,
				documents: [
					{ '__xmlns:a': 'http://schemas.datacontract.org/2004/07/Horizon.Business' },
					{ '__xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance' },
					await parseFile(req)
				]
			}
		};

		context.log('Uploading documents to Horizon');

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
		context.log(err, 'Error');
		let message;
		let httpStatus = 500;

		/* istanbul ignore else */
		if (err.response) {
			message = err.message;
			context.log(message);
		} else if (err.request) {
			message = err.message;
			httpStatus = 400;
			context.log(message);
		} else {
			message = 'General error';
			context.log(
				{
					message: err?.message,
					stack: err?.stack
				},
				message
			);
		}

		context.httpStatus = httpStatus;

		return {
			message
		};
	}
};

module.exports.createDataObject = createDataObject;
// module.exports.getCaseReferenceFromAPI = getCaseReferenceFromAPI;
