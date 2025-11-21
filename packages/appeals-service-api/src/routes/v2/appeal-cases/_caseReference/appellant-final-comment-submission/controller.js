const {
	getAppellantFinalCommentByAppealId,
	createAppellantFinalComment,
	patchAppellantFinalCommentByAppealId
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { Prisma } = require('@pins/database/src/client');

/**
 * @type {import('express').RequestHandler}
 */
async function getAppellantFinalCommentSubmission(req, res) {
	try {
		const content = await getAppellantFinalCommentByAppealId(req.params.caseReference);
		if (!content) {
			throw ApiError.withMessage(404, 'Comment not found');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get comment: ${error.code} // ${error.message.errors}`);
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
async function createAppellantFinalCommentSubmission(req, res) {
	try {
		const content = await createAppellantFinalComment(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(400, 'Unable to create comment');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create comment: ${error.code} // ${error.message.errors}`);
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
async function patchAppellantFinalCommentSubmission(req, res) {
	try {
		const content = await patchAppellantFinalCommentByAppealId(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(404, 'Comment not found');
		}
		res.status(200).send(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to update comment: ${error.code} // ${error.message.errors}`);
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
	getAppellantFinalCommentSubmission,
	createAppellantFinalCommentSubmission,
	patchAppellantFinalCommentSubmission
};
