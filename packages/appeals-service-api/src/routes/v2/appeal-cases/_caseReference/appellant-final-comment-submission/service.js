const { AppellantFinalCommentSubmissionRepository } = require('./repo');

const repo = new AppellantFinalCommentSubmissionRepository();

/**
 * @typedef {import('./appellant-final-comment-submission').AppellantFinalCommentSubmission} AppellantFinalCommentSubmission
 */

/**
 * Get Appellant Final Comment for an appealCase
 *
 * @param {string} appealCaseId
 * @return {Promise<AppellantFinalCommentSubmission|null>}
 */
async function getAppellantFinalCommentByAppealId(appealCaseId) {
	const comment = await repo.getAppellantFinalCommentByAppealRef(appealCaseId);

	if (!comment) {
		return null;
	}

	return comment;
}

/**
 * Create AppellantFinalComment for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').FinalCommentData} finalCommentData
 * @returns {Promise<Omit<AppellantFinalCommentSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function createAppellantFinalComment(appealCaseId, finalCommentData) {
	const comment = await repo.createAppellantFinalComment(appealCaseId, finalCommentData);

	if (!comment) {
		return null;
	}

	return comment;
}

/**
 * Put AppellantFinalComment for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').FinalCommentData} finalCommentData
 * @returns {Promise<Omit<AppellantFinalCommentSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function patchAppellantFinalCommentByAppealId(appealCaseId, finalCommentData) {
	const comment = await repo.patchAppellantFinalCommentByAppealId(appealCaseId, finalCommentData);

	if (!comment) {
		return null;
	}

	return comment;
}

/**
 * mark comment as submitted to back office
 *
 * @param {string} caseReference
 * @param {string} appellantCommentsSubmitted
 * @return {Promise<{id: string}>}
 */
function markAppellantFinalCommentAsSubmitted(caseReference, appellantCommentsSubmitted) {
	return repo.markAppellantFinalCommentAsSubmitted(caseReference, appellantCommentsSubmitted);
}

module.exports = {
	getAppellantFinalCommentByAppealId,
	createAppellantFinalComment,
	patchAppellantFinalCommentByAppealId,
	markAppellantFinalCommentAsSubmitted
};
