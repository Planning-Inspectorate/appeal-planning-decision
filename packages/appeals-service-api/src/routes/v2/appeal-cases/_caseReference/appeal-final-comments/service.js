const { AppealFinalCommentRepository } = require('./repo');
const repo = new AppealFinalCommentRepository();
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');

/**
 * @typedef {import('@prisma/client').FinalComment} FinalComment
 */

/**
 *
 * @param {string} caseReference
 * @param {string} type
 * @returns {Promise<Array<FinalComment>|null>}
 */
async function getFinalComments(caseReference, type) {
	let comments;
	if (type === LPA_USER_ROLE) {
		comments = await repo.getLPAFinalComments(caseReference);
	} else if (type === APPEAL_USER_ROLES.APPELLANT || type === APPEAL_USER_ROLES.RULE_6_PARTY) {
		comments = await repo.getServiceUserFinalComments(caseReference, type);
	} else {
		throw new Error('Invalid comment type');
	}
	return comments;
}
module.exports = { getFinalComments };
