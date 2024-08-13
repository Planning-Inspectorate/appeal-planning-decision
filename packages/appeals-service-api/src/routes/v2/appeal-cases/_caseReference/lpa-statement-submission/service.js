const { LPAStatementSubmissionRepository } = require('./repo');

const repo = new LPAStatementSubmissionRepository();

/**
 * @typedef {import('@prisma/client').LPAStatementSubmission} LPAStatementSubmission
 */

/**
 * Get Statement for an appealCase
 *
 * @param {string} appealCaseId
 * @return {Promise<LPAStatementSubmission|null>}
 */
async function getLPAStatementByAppealId(appealCaseId) {
	const statement = await repo.getLPAStatementByAppealRef(appealCaseId);

	if (!statement) {
		return null;
	}

	return statement;
}

/**
 * Create Statement for an appealCase
 *
 * @param {string} appealCaseId
 * @returns {Promise<Omit<LPAStatementSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function createLPAStatement(appealCaseId) {
	const statement = await repo.createStatement(appealCaseId);

	if (!statement) {
		return null;
	}

	return statement;
}

/**
 * Put Statement for an appealCase
 *
 * @param {string} appealCaseId
 * @param {LPAStatementSubmission} data
 * @returns {Promise<Omit<LPAStatementSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function patchLPAStatementByAppealId(appealCaseId, data) {
	const statement = await repo.patchLPAStatementByAppealId(appealCaseId, data);

	if (!statement) {
		return null;
	}

	return statement;
}

/**
 * mark statement as submitted to back office
 *
 * @param {string} statementId
 * @return {Promise<{id: string}>}
 */
function markStatementAsSubmitted(statementId) {
	return repo.markLPAStatementAsSubmitted(statementId);
}

module.exports = {
	getLPAStatementByAppealId,
	createLPAStatement,
	patchLPAStatementByAppealId,
	markStatementAsSubmitted
};
