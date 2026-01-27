const {
	getAppellantStatementByAppealId,
	createAppellantStatement,
	patchAppellantStatementByAppealId
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { Prisma } = require('@pins/database/src/client/client');

/**
 * @type {import('express').RequestHandler}
 */
async function getAppellantStatementSubmission(req, res) {
	try {
		const content = await getAppellantStatementByAppealId(req.params.caseReference);
		if (!content) {
			throw ApiError.withMessage(404, 'Statement not found');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get statement: ${error.code} // ${error.message.errors}`);
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
async function createAppellantStatementSubmission(req, res) {
	try {
		const content = await createAppellantStatement(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(400, 'Unable to create statement');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create statement: ${error.code} // ${error.message.errors}`);
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
async function patchAppellantStatementSubmission(req, res) {
	try {
		const content = await patchAppellantStatementByAppealId(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(404, 'Statement not found');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to update statement: ${error.code} // ${error.message.errors}`);
			res.status(error.code || 500).send(error.message.errors);
		} else if (error instanceof Prisma.PrismaClientValidationError) {
			logger.error(`invalid request: ${error.message}`);
			res.status(400).send({ errors: ['Bad request'] });
		} else {
			logger.error(error);
			res.status(500).send('An unexpected error occurred');
		}
	}
}

module.exports = {
	getAppellantStatementSubmission,
	createAppellantStatementSubmission,
	patchAppellantStatementSubmission
};
