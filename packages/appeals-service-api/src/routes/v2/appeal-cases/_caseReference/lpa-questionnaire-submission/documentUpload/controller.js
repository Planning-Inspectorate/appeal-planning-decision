const { createSubmissionDocument } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').RequestHandler}
 */
async function createSubmissionDocumentUpload(req, res) {
	try {
		// const { 'lpa-code': lpaCode } = req.query;
		// if (!lpaCode || typeof lpaCode !== 'string') {
		// 	throw ApiError.withMessage(400, 'lpa-code is required');
		// }
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
	createSubmissionDocumentUpload
};
