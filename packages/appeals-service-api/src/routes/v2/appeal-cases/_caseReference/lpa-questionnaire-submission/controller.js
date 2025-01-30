const {
	getLPAQuestionnaireByAppealId,
	createLPAQuestionnaire,
	patchLPAQuestionnaireByAppealId,
	getLPAQuestionnaireDownloadDetails
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');

/**
 * @type {import('express').RequestHandler}
 */
async function getLPAQuestionnaireSubmission(req, res) {
	try {
		const content = await getLPAQuestionnaireByAppealId(req.params.caseReference);
		if (!content) {
			throw ApiError.questionnaireNotFound();
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get questionnaire: ${error.code} // ${error.errors}`);
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
async function createLPAQuestionnaireSubmission(req, res) {
	try {
		const content = await createLPAQuestionnaire(req.params.caseReference);
		if (!content) {
			throw ApiError.unableToCreateQuestionnaire();
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create questionnaire: ${error.code} // ${error.errors}`);
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
async function patchLPAQuestionnaireSubmission(req, res) {
	try {
		const content = await patchLPAQuestionnaireByAppealId(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.questionnaireNotFound();
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to update questionnaire: ${error.code} // ${error.errors}`);
			res.status(error.code).json(error.errors);
		} else if (error instanceof PrismaClientValidationError) {
			logger.error(`invalid request: ${error.message}`);
			res.status(400).json({ errors: ['Bad request'] });
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

// Endpoint for retrieving details required for lpaq submission pdf
/**
 * @type {import('express').RequestHandler}
 */
async function getLPAQuestionnaireDownloadDetailsByCaseReference(req, res) {
	const caseReference = req.params.caseReference;

	if (!caseReference) {
		throw ApiError.badRequest({ errors: ['Case reference is required'] });
	}

	const userId = req.auth.payload.sub;

	if (!userId) {
		throw ApiError.invalidToken();
	}

	const result = await getLPAQuestionnaireDownloadDetails(caseReference);

	res.json(result);
}

module.exports = {
	getLPAQuestionnaireSubmission,
	createLPAQuestionnaireSubmission,
	patchLPAQuestionnaireSubmission,
	getLPAQuestionnaireDownloadDetailsByCaseReference
};
