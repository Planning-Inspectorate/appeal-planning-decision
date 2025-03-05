const {
	downloadFile,
	uploadFile,
	deleteFile,
	getMetadataForAllFiles,
	getMetadataForSingleFile
} = require('../lib/blobStorage');
const deleteLocalFile = require('../lib/deleteLocalFile');
const { documentTypes, initContainerClient } = require('@pins/common');
const logger = require('../lib/logger');
const config = require('../configuration/config');

const getDocumentsForApplication = async (req, res) => {
	const { applicationId } = req.params;

	try {
		const containerClient = await initContainerClient(config);
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
		const containerClient = await initContainerClient(config);
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
		const containerClient = await initContainerClient(config);
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

const uploadDocument = async (req, res) => {
	const {
		file,
		file: { mimetype, originalname, filename, size, id, uploadDate } = {},
		body: { documentType },
		params: { applicationId }
	} = req;

	try {
		const containerClient = await initContainerClient(config);

		req.log.info({ file, applicationId }, 'Uploading new file');

		let document = {
			application_id: applicationId,
			name: originalname,
			filename,
			upload_date: uploadDate,
			mime_type: mimetype,
			location: `${applicationId}/${id}/${originalname}`,
			size: String(size),
			id,
			document_type: documentType,
			involvement: documentTypes[documentType].involvement
		};

		let horizonMetadata = _getHorizonMetadata(documentType);
		document = { ...document, ...horizonMetadata };
		logger.info(document, 'Document');

		req.log.info(
			{
				applicationId,
				docName: document.name
			},
			'Uploading document'
		);

		const metadata = await uploadFile(containerClient, document);
		await deleteLocalFile(file);

		if (metadata) {
			delete metadata['horizon_document_type'];
			delete metadata['horizon_document_group_type'];
		}

		// TODO: this should only be sending back the document's `id`; all other data is superfluous.
		// It's also very confusing and threw us for a week on AS-5031: since this returns all the metadata
		// for a document, we thought this was the only place we could get it, so transferred this data
		// throughout the other systems to the Horizon functions. However, it turns out that you can get
		// this data via `serveDocumentById()` above, and the other data used from the return value here is
		// only used because "needed for Cypress testing" in other systems :/
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
		const containerClient = await initContainerClient(config);
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

const _getHorizonMetadata = (documentType) => {
	let horizonMetadata = {
		horizon_document_type: documentTypes[documentType].horizonDocumentType,
		horizon_document_group_type: documentTypes[documentType].horizonDocumentGroupType
	};

	return horizonMetadata;
};

module.exports = {
	getDocumentsForApplication,
	getDocumentById,
	serveDocumentById,
	uploadDocument,
	deleteDocument
};
