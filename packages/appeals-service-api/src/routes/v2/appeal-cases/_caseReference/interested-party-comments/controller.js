const { getInterestedPartyComments, createInterestedPartyComment } = require('./service');
const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');

/**
 * @type {import('express').Handler}
 */
async function getCommentsForCase(req, res) {
	const { caseReference } = req.params;

	if (!caseReference) {
		throw ApiError.withMessage(400, 'Case reference is required');
	}

	const comments = await getInterestedPartyComments(caseReference);

	if (comments?.length === 0) {
		throw ApiError.withMessage(404, 'No comments found for this case reference');
	}

	res.status(200).send(comments);
}

/**
 * @type {import('express').Handler}
 */
async function createComment(req, res) {
	try {
		const commentData = req.body;
		const { caseReference } = req.params;

		if (!commentData.caseReference || !commentData.comment) {
			logger.error('Validation error', { caseReference, commentData });
			throw ApiError.withMessage(400, 'Case reference and comments are required');
		}

		const createdComment = await createInterestedPartyComment({ ...commentData, caseReference });

		res.status(200).send(createdComment);
	} catch (err) {
		logger.error('Error creating comment', { err });
		throw err;
	}
}

module.exports = { getCommentsForCase, createComment };
