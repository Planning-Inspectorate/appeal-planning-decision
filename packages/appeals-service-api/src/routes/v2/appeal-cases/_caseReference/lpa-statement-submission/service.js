const { LPAStatementSubmissionRepository } = require('./repo');

const repo = new LPAStatementSubmissionRepository();

/**
 * @typedef {import('./lpa-statement-submission').LPAStatementSubmission} LPAStatementSubmission
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
 * @param {import('./repo').StatementData} statementData
 * @returns {Promise<Omit<LPAStatementSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function createLPAStatement(appealCaseId, statementData) {
	const statement = await repo.createStatement(appealCaseId, statementData);

	if (!statement) {
		return null;
	}

	return statement;
}

/**
 * Put Statement for an appealCase
 *
 * @param {string} appealCaseId
 * @param {import('./repo').StatementData} data
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
 * @param {string} appealCaseReference
 * @param {string} lpaStatementSubmittedDate
 * @return {Promise<{id: string}>}
 */
function markStatementAsSubmitted(appealCaseReference, lpaStatementSubmittedDate) {
	return repo.markLPAStatementAsSubmitted(appealCaseReference, lpaStatementSubmittedDate);
}

module.exports = {
	getLPAStatementByAppealId,
	createLPAStatement,
	patchLPAStatementByAppealId,
	markStatementAsSubmitted
};
