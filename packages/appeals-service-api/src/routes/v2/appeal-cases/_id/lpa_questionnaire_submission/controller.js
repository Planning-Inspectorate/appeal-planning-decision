const { getLPAQuestionnaireByAppealId } = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').Handler}
 */
async function getLPAQuestionnaireSubmission(req, res) {
	try {
		const content = await getLPAQuestionnaireByAppealId(req.params.id);
		if (!content) {
			throw ApiError.questionnaireNotFound();
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get questionnaire: ${error.code} // ${error.message.errors}`);
			res.status(error.code || 500).send(error.message.errors);
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

module.exports = {
	getLPAQuestionnaireSubmission
};
