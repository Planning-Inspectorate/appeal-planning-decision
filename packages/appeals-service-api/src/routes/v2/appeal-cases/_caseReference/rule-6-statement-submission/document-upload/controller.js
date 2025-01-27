const { createSubmissionDocument, deleteSubmissionDocument } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionDocumentUpload(req, res) {
	try {
		const userId = req.auth?.payload.sub;
		const caseReference = req.params.caseReference;
		const content = await createSubmissionDocument(userId, caseReference, req.body);
		if (!content) {
			throw ApiError.unableToCreateDocumentUpload();
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create document upload: ${error.code} // ${error.errors}`);
			res.status(error.code).json(error.errors);
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
		const userId = req.auth?.payload.sub;
		const { caseReference, documentId } = req.params;
		const content = await deleteSubmissionDocument(userId, caseReference, documentId);
		if (!content) {
			throw ApiError.unableToDeleteDocumentUpload();
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to delete document upload: ${error.code} // ${error.errors}`);
			res.status(error.code).json(error.errors);
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
