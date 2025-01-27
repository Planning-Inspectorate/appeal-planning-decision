const {
	getLPAStatementByAppealId,
	createLPAStatement,
	patchLPAStatementByAppealId
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');

/**
 * @type {import('express').RequestHandler}
 */
async function getLPAStatementSubmission(req, res) {
	try {
		const content = await getLPAStatementByAppealId(req.params.caseReference);
		if (!content) {
			throw ApiError.withMessage(404, 'Statement not found');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get statement: ${error.code} // ${error.errors}`);
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
async function createLPAStatementSubmission(req, res) {
	try {
		const content = await createLPAStatement(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(400, 'Unable to create statement');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create statement: ${error.code} // ${error.errors}`);
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
async function patchLPAStatementSubmission(req, res) {
	try {
		const content = await patchLPAStatementByAppealId(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(404, 'Statement not found');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to update statement: ${error.code} // ${error.errors}`);
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
	getLPAStatementSubmission,
	createLPAStatementSubmission,
	patchLPAStatementSubmission
};
