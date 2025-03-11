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

	const statement = await repo.getRule6StatementByAppealRef(userId, appealCaseId);

	if (!statement) {
		return null;
	}

	return statement;
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
	const statement = await repo.createRule6Statement(userId, appealCaseId, statementData);

	if (!statement) {
		return null;
	}

	return statement;
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

	const statement = await repo.patchRule6StatementByAppealId(userId, appealCaseId, statementData);

	if (!statement) {
		return null;
	}

	return statement;
}

/**
 * mark Rule 6 Party Statement Submission as submitted to back office
 *
 * @param {string} userId
 * @param {string} caseReference
 * @return {Promise<{id: string}>}
 */
function markRule6StatementAsSubmitted(userId, caseReference) {
	return repo.markRule6StatementAsSubmitted(userId, caseReference);
}

module.exports = {
	getRule6StatementByAppealId,
	createRule6Statement,
	patchRule6StatementByAppealId,
	markRule6StatementAsSubmitted
};
