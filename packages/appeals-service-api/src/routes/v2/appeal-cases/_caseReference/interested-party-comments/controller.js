const { getInterestedPartyComments, createInterestedPartyComment } = require('./service');
const ApiError = require('#errors/apiError');

/**
 * @type {import('express').Handler}
 */
async function getCommentsForCase(req, res) {
	const { caseReference } = req.params;

	if (!caseReference) {
		throw ApiError.withMessage(400, 'case reference is required');
	}

	const comments = await getInterestedPartyComments(caseReference);

	if (!comments) {
		throw ApiError.withMessage(404, 'no comments found for this case reference');
	}

	res.status(200).send(comments);
}

/**
 * @type {import('express').Handler}
 */
async function createComment(req, res) {
	const commentData = req.body;

	if (!commentData.caseReference || !commentData.comment) {
		throw ApiError.withMessage(400, 'case reference and comments are required');
	}

	const createdComment = await createInterestedPartyComment(commentData);

	res.status(200).send(createdComment);
}

module.exports = { getCommentsForCase, createComment };
