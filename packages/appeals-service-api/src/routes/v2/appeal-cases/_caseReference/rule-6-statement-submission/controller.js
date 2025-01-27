const {
	getRule6StatementByAppealId,
	createRule6Statement,
	patchRule6StatementByAppealId
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');

/**
 * @type {import('express').RequestHandler}
 */
async function getRule6StatementSubmission(req, res) {
	const userId = req.auth?.payload.sub;

	try {
		const content = await getRule6StatementByAppealId(userId, req.params.caseReference);
		if (!content) {
			throw ApiError.withMessage(404, 'Rule 6 Statement not found');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get rule 6 statement: ${error.code} // ${error.errors}`);
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
async function createRule6StatementSubmission(req, res) {
	const userId = req.auth?.payload.sub;

	try {
		const content = await createRule6Statement(userId, req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(400, 'Unable to create rule 6 statement');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create rule 6 statement: ${error.code} // ${error.errors}`);
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
async function patchRule6StatementSubmission(req, res) {
	const userId = req.auth?.payload.sub;

	try {
		const content = await patchRule6StatementByAppealId(userId, req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(404, 'Rule 6 Statement not found');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to update rule 6 statement: ${error.code} // ${error.errors}`);
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

module.exports = {
	getRule6StatementSubmission,
	createRule6StatementSubmission,
	patchRule6StatementSubmission
};
