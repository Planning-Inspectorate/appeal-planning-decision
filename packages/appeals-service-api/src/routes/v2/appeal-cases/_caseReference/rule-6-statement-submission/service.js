const { Rule6StatementSubmissionRepository } = require('./repo');

const repo = new Rule6StatementSubmissionRepository();

/**
 * @typedef {import('./rule-6-statement-submission').Rule6StatementSubmission} Rule6StatementSubmission
 */

/**
 * Get Rule 6 Party Statement Submission for an appealCase
 *
 * @param {string | undefined} userId
 * @param {string} appealCaseId
 * @return {Promise<Rule6StatementSubmission|null>}
 */
async function getRule6StatementByAppealId(userId, appealCaseId) {
	if (!userId) {
		return null;
	}

	const proofs = await repo.getRule6StatementByAppealRef(userId, appealCaseId);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * Create Rule 6 Party Statement Submission for an appealCase
 *
 * @param {string | undefined} userId
 * @param {string} appealCaseId
 * @param {import('./repo').Rule6StatementData} statementData
 * @returns {Promise<Omit<Rule6StatementSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function createRule6Statement(userId, appealCaseId, statementData) {
	if (!userId) {
		return null;
	}
	const proofs = await repo.createRule6Statement(userId, appealCaseId, statementData);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * Put Rule 6 Party Statement Submission for an appealCase
 *
 * @param {string | undefined} userId
 * @param {string} appealCaseId
 * @param {import('./repo').Rule6StatementData} statementData
 * @returns {Promise<Omit<Rule6StatementSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function patchRule6StatementByAppealId(userId, appealCaseId, statementData) {
	if (!userId) {
		return null;
	}

	const proofs = await repo.patchRule6StatementByAppealId(userId, appealCaseId, statementData);

	if (!proofs) {
		return null;
	}

	return proofs;
}

/**
 * mark Rule 6 Party Statement Submission as submitted to back office
 *
 * @param {string} userId
 * @param {string} caseReference
 * @param {string} submissionDate
 * @return {Promise<{id: string}>}
 */
function markRule6StatementAsSubmitted(userId, caseReference, submissionDate) {
	return repo.markRule6StatementAsSubmitted(userId, caseReference, submissionDate);
}

module.exports = {
	getRule6StatementByAppealId,
	createRule6Statement,
	patchRule6StatementByAppealId,
	markRule6StatementAsSubmitted
};
