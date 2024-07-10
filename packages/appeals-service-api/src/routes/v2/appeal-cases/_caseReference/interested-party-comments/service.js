const { InterestedPartyCommentRepository } = require('./repo');
const repo = new InterestedPartyCommentRepository();

/**
 * @typedef {import('@prisma/client').InterestedPartyComment} InterestedPartyComment
 * @typedef {Object} CommentData
 * @property {string} caseReference
 * @property {string} serviceUserId
 * @property {string} comment
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
