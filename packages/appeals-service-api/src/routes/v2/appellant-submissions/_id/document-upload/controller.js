const { createSubmissionDocument, deleteSubmissionDocument } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionDocumentUpload(req, res) {
	try {
		const id = req.params.id;
		const content = await createSubmissionDocument(id, req.body);
		if (!content) {
			throw ApiError.unableToCreateDocumentUpload();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create document upload: ${error.code} // ${error.errors}`);
			res.status(error.code || 500).send(error.errors);
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function deleteSubmissionDocumentUpload(req, res) {
	try {
		const { id, documentId } = req.params;
		const content = await deleteSubmissionDocument(id, documentId);
		if (!content) {
			throw ApiError.unableToDeleteDocumentUpload();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to delete document upload: ${error.code} // ${error.errors}`);
			res.status(error.code || 500).send(error.errors);
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

module.exports = {
	createSubmissionDocumentUpload,
	deleteSubmissionDocumentUpload
};
