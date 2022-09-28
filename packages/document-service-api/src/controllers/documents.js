const {
	initContainerClient,
	downloadFile,
	uploadFile,
	deleteFile,
	getMetadataForAllFiles,
	getMetadataForSingleFile
} = require('../lib/blobStorage');
const deleteLocalFile = require('../lib/deleteLocalFile');
const { documentTypes } = require('@pins/common');

const getDocumentsForApplication = async (req, res) => {
	console.log('hey')
	const { applicationId } = req.params;

	try {
		const containerClient = await initContainerClient();
		const documents = await getMetadataForAllFiles(containerClient, applicationId);

		if (documents.length) {
			res.send(documents);
			return;
		}

		req.log.debug('Invalid application id');
		res.status(404).send({
			message: 'Invalid application id'
		});
	} catch (err) {
		req.log.error({ err }, 'Failed to get documents for application');
		res.status(500).send({
			message: err.message
		});
	}
};

const getDocumentById = async (req, res) => {
	const { applicationId, documentId } = req.params;

	try {
		const containerClient = await initContainerClient();
		const document = await getMetadataForSingleFile(containerClient, applicationId, documentId);

		if (document) {
			res.send(document);
			return;
		}

		req.log.debug({ applicationId, documentId }, 'Invalid application or document id');
		res.status(404).send({
			message: 'Invalid application or document id'
		});
	} catch (err) {
		req.log.error({ err }, 'Failed to get document');
		res.status(500).send({
			message: err.message
		});
	}
};

const serveDocumentById = async (req, res) => {
	const { applicationId, documentId } = req.params;

	try {
		const containerClient = await initContainerClient();
		const { metadata } =
			(await getMetadataForSingleFile(containerClient, applicationId, documentId)) || {};

		if (!metadata) {
			req.log.debug({ applicationId, documentId }, 'Invalid application or document id');
			res.status(404).send({
				message: 'Invalid application or document id'
			});
			return;
		}

		req.log.info('Downloading file');

		const fileBuffer = await downloadFile(containerClient, metadata.location);

		if (req.query.base64 === 'true') {
			req.log.info('Converting file to base64');
			const base64FileBuffer = fileBuffer.toString('base64');

			res.send({
				...metadata,
				dataSize: base64FileBuffer.length,
				data: base64FileBuffer
			});
			return;
		}

		const fileName = metadata.name;
		const mimeType = metadata.mime_type;
		req.log.info({ mimeType }, 'Displaying file');
		res.set('content-type', mimeType);
		res.set('x-original-file-name', fileName);
		res.send(fileBuffer);
	} catch (err) {
		req.log.error({ err }, 'Failed to get document');
		res.status(500).send({
			message: err.message
		});
	}
};

const addHorizonMetadata = async (req, res) => {
	// //This is currently set to @documentTypes.name, which will never line up with the documentTypes mappings file, due to this using
	// //documentTypes object in common to map this value to the display name will allow the values to match correctly
	// const documentName = documentTypes.documentType.displayName;
	// body.append('documentName', documentName);

	// //If there is an associated GroupType for the documentType append this to the body
	// if (documentTypes[documentType].groupType) {
	// 	const documentGroupTypeValue = documentTypes[documentType].groupType;
	// 	body.append('documentGroupTypeValue', documentGroupTypeValue);
	// }
}

const uploadDocument = async (req, res) => {
	const {
		file,
		file: { mimetype, originalname, filename, size, id, uploadDate } = {},
		body: { documentType },
		params: { applicationId }
	} = req;

	try {
		const containerClient = await initContainerClient();

		req.log.info({ file, applicationId }, 'Uploading new file');

		const document = {
			application_id: applicationId,
			name: originalname,
			filename,
			upload_date: uploadDate,
			mime_type: mimetype,
			location: `${applicationId}/${id}/${originalname}`,
			size: String(size),
			id,
			document_type: documentType
		};

		req.log.info(
			{
				applicationId,
				docName: document.name
			},
			'Uploading document'
		);

		const metadata = await uploadFile(containerClient, document);

		await deleteLocalFile(file);

		res.status(202).send(metadata);
	} catch (err) {
		req.log.error({ err }, 'Failed to upload document');
		res.status(500).send({
			message: err.message
		});
	}
};

const deleteDocument = async (req, res) => {
	const { applicationId, documentId } = req.params;

	try {
		const containerClient = await initContainerClient();
		const { metadata } =
			(await getMetadataForSingleFile(containerClient, applicationId, documentId)) || {};

		if (!metadata) {
			req.log.debug({ applicationId, documentId }, 'Invalid application or document id');
			res.status(404).send({
				message: 'Invalid application or document id'
			});
			return;
		}

		req.log.info('Deleting file');

		const success = await deleteFile(containerClient, metadata.location);

		if (success) {
			res.status(204).send();
			return;
		}

		req.log.error('Failed to delete document');
		res.status(500).send({
			message: 'Failed to delete document'
		});
	} catch (err) {
		req.log.error('Failed to delete document');
		res.status(500).send({
			message: err.message
		});
	}
};

module.exports = {
	getDocumentsForApplication,
	getDocumentById,
	serveDocumentById,
	uploadDocument,
	deleteDocument
};
