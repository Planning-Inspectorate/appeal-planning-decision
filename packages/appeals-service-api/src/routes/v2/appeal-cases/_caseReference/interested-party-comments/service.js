const { InterestedPartyCommentRepository } = require('./repo');
const repo = new InterestedPartyCommentRepository();

/**
 * @typedef {import('@prisma/client').InterestedPartyComment} InterestedPartyComment
 * @typedef {import("@prisma/client").Prisma.InterestedPartyCommentCreateInput} CommentData
 */

/**
 * Get all comments for a case
 *
 * @param {string} caseReference
 * @returns {Promise<InterestedPartyComment[]|null>}
 */
async function getInterestedPartyComments(caseReference) {
	return await repo.listCommentsForCase(caseReference);
}

/**
 * Create a new interested party
 *
 * @param {CommentData} commentData
 * @returns {Promise<InterestedPartyComment>}
 */
async function createInterestedPartyComment(commentData) {
	return await repo.postComment(commentData);
}

module.exports = { getInterestedPartyComments, createInterestedPartyComment };
