const { createSubmissionDocument, deleteSubmissionDocument } = require('./service');
const logger = require('#lib/logger.js');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionDocumentUpload(req, res) {
	try {
		const caseReference = req.params.caseReference;
		const content = await createSubmissionDocument(caseReference, req.body);
		if (!content) {
			throw ApiError.unableToCreateDocumentUpload();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create document upload: ${error.code} // ${error.message.errors}`);
			res.status(error.code || 500).send(error.message.errors);
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
		const { caseReference } = req.params;
		const documentIds = req.body;
		const content = await deleteSubmissionDocument(caseReference, documentIds);
		if (!content) {
			throw ApiError.unableToDeleteDocumentUpload();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to delete document upload: ${error.code} // ${error.message.errors}`);
			res.status(error.code || 500).send(error.message.errors);
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
