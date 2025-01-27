const {
	getLPAFinalCommentByAppealId,
	createLPAFinalComment,
	patchLPAFinalCommentByAppealId
} = require('./service');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');

/**
 * @type {import('express').RequestHandler}
 */
async function getLPAFinalCommentSubmission(req, res) {
	try {
		const content = await getLPAFinalCommentByAppealId(req.params.caseReference);
		if (!content) {
			throw ApiError.withMessage(404, 'LPA Final Comment not found');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to get LPA Final Comment: ${error.code} // ${error.errors}`);
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
async function createLPAFinalCommentSubmission(req, res) {
	try {
		const content = await createLPAFinalComment(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(400, 'Unable to create LPA Final Comment');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to create LPA Final Comment: ${error.code} // ${error.errors}`);
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
async function patchLPAFinalCommentSubmission(req, res) {
	try {
		const content = await patchLPAFinalCommentByAppealId(req.params.caseReference, req.body);
		if (!content) {
			throw ApiError.withMessage(404, 'LPA Final Comment not found');
		}
		res.status(200).json(content);
	} catch (error) {
		if (error instanceof ApiError) {
			logger.error(`Failed to update LPA Final Comment: ${error.code} // ${error.errors}`);
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
	getLPAFinalCommentSubmission,
	createLPAFinalCommentSubmission,
	patchLPAFinalCommentSubmission
};
