const { getDocumentUploads, createSubmissionDocument } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function getSubmissionUploads(req, res) {
	try {
		const { 'questionnaire-id': questionnaireId } = req.query;
		if (!questionnaireId || typeof questionnaireId !== 'string') {
			throw ApiError.withMessage(400, 'questionnaire id is required');
		}
		const content = await getDocumentUploads(questionnaireId);
		if (!content) {
			throw ApiError.unableToGetDocumentUploads();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get document uploads: ${error.code} // ${error.message.errors}`);
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
async function createSubmissionDocumentUpload(req, res) {
	try {
		const content = await createSubmissionDocument(req.body);
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

module.exports = {
	createSubmissionDocumentUpload,
	getSubmissionUploads
};
