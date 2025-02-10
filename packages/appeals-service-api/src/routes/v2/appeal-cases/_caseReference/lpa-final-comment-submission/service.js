const { LPAFinalCommentSubmissionRepository } = require('./repo');

const repo = new LPAFinalCommentSubmissionRepository();

/**
 * @typedef {import('./lpa-final-comment-submission').LPAFinalCommentSubmission} LPAFinalCommentSubmission
 */

/**
 * Get LPA Final Comment for an appealCase
 *
 * @param {string} appealCaseId
 * @return {Promise<LPAFinalCommentSubmission|null>}
 */
async function getLPAFinalCommentByAppealId(appealCaseId) {
	const comment = await repo.getLPAFinalCommentByAppealRef(appealCaseId);

	if (!comment) {
		return null;
	}

	return comment;
}

/**
 * Create LPAFinalCommentSubmission for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').FinalCommentData} finalCommentData
 * @returns {Promise<Omit<LPAFinalCommentSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function createLPAFinalComment(appealCaseId, finalCommentData) {
	const comment = await repo.createLPAFinalComment(appealCaseId, finalCommentData);

	if (!comment) {
		return null;
	}

	return comment;
}

/**
 * Put LPAFinalCommentSubmission for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').FinalCommentData} finalCommentData
 * @returns {Promise<Omit<LPAFinalCommentSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function patchLPAFinalCommentByAppealId(appealCaseId, finalCommentData) {
	const comment = await repo.patchLPAFinalCommentByAppealId(appealCaseId, finalCommentData);

	if (!comment) {
		return null;
	}

	return comment;
}

/**
 * mark comment as submitted to back office
 *
 * @param {string} caseReference
 * @param {string} LPACommentsSubmittedDate
 * @return {Promise<{id: string}>}
 */
function markLPAFinalCommentAsSubmitted(caseReference, LPACommentsSubmittedDate) {
	return repo.markLPAFinalCommentAsSubmitted(caseReference, LPACommentsSubmittedDate);
}

module.exports = {
	getLPAFinalCommentByAppealId,
	createLPAFinalComment,
	patchLPAFinalCommentByAppealId,
	markLPAFinalCommentAsSubmitted
};
