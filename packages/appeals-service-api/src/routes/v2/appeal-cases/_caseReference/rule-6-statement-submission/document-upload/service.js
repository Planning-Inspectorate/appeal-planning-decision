const { SubmissionDocumentUploadRepository } = require('./repo');

const repo = new SubmissionDocumentUploadRepository();

/**
 * @typedef {import('@pins/database/src/client/client').Rule6StatementSubmission} Rule6StatementSubmission
 * @typedef {import('./repo').DocumentUploadData} DocumentUploadData
 */

/**
 * Create a SubmissionDocumentUpload entry
 *
 * @param {string | undefined} userId
 * @param {string} caseReference
 * @param {DocumentUploadData[]} uploadData
 * @return {Promise<Rule6StatementSubmission|null>}
 */
async function createSubmissionDocument(userId, caseReference, uploadData) {
	if (!userId) {
		return null;
	}

	const updatedStatement = await repo.createSubmissionDocument(userId, caseReference, uploadData);

	if (!updatedStatement) {
		return null;
	}

	return updatedStatement;
}

/**
 * Delete a SubmissionDocumentUpload entry
 *
 * @param {string|undefined} userId
 * @param {string} caseReference
 * @param {string[]} documentIds
 * @return {Promise<Rule6StatementSubmission|null>}
 */
async function deleteSubmissionDocument(userId, caseReference, documentIds) {
	if (!userId) {
		return null;
	}

	const updatedStatement = await repo.deleteSubmissionDocument(userId, caseReference, documentIds);

	if (!updatedStatement) {
		return null;
	}

	return updatedStatement;
}

module.exports = {
	createSubmissionDocument,
	deleteSubmissionDocument
};
