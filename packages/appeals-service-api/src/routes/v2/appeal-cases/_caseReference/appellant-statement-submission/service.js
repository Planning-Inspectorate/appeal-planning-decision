const { AppellantStatementSubmissionRepository } = require('./repo');

const repo = new AppellantStatementSubmissionRepository();

/**
 * @typedef {import('./appellant-statement-submission').AppellantStatementSubmission} AppellantStatementSubmission
 */

/**
 * Get Statement for an appealCase
 *
 * @param {string} appealCaseId
 * @return {Promise<AppellantStatementSubmission|null>}
 */
async function getAppellantStatementByAppealId(appealCaseId) {
	const statement = await repo.getAppellantStatementByAppealRef(appealCaseId);

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
 * @returns {Promise<Omit<AppellantStatementSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function createAppellantStatement(appealCaseId, statementData) {
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
 * @returns {Promise<Omit<AppellantStatementSubmission, 'SubmissionDocumentUpload'> | null>}
 */
async function patchAppellantStatementByAppealId(appealCaseId, data) {
	const statement = await repo.patchAppellantStatementByAppealId(appealCaseId, data);

	if (!statement) {
		return null;
	}

	return statement;
}

/**
 * mark statement as submitted to back office
 *
 * @param {string} appealCaseReference
 * @param {string} appellantStatementSubmittedDate
 * @return {Promise<{id: string}>}
 */
function markAppellantStatementAsSubmitted(appealCaseReference, appellantStatementSubmittedDate) {
	return repo.markAppellantStatementAsSubmitted(
		appealCaseReference,
		appellantStatementSubmittedDate
	);
}

module.exports = {
	getAppellantStatementByAppealId,
	createAppellantStatement,
	patchAppellantStatementByAppealId,
	markAppellantStatementAsSubmitted
};
