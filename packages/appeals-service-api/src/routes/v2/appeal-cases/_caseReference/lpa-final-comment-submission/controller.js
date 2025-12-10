const {
	getLPAFinalCommentByAppealId,
	createLPAFinalComment,
	patchLPAFinalCommentByAppealId
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { Prisma } = require('@pins/database/src/client/client');

/**
 * @type {import('express').RequestHandler}
 */
async function getLPAFinalCommentSubmission(req, res) {
	try {
		const content = await getLPAFinalCommentByAppealId(req.params.caseReference);
		if (!content) {
			throw ApiError.withMessage(404, 'LPA Final Comment not found');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get LPA Final Comment: ${error.code} // ${error.message.errors}`);
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
async function createLPAFinalCommentSubmission(req, res) {
	try {
		const content = await createLPAFinalComment(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(400, 'Unable to create LPA Final Comment');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create LPA Final Comment: ${error.code} // ${error.message.errors}`);
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
async function patchLPAFinalCommentSubmission(req, res) {
	try {
		const content = await patchLPAFinalCommentByAppealId(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(404, 'LPA Final Comment not found');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to update LPA Final Comment: ${error.code} // ${error.message.errors}`);
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
	getLPAFinalCommentSubmission,
	createLPAFinalCommentSubmission,
	patchLPAFinalCommentSubmission
};
