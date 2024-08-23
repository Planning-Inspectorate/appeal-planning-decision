const { SubmissionDocumentUploadRepository } = require('./repo');

const repo = new SubmissionDocumentUploadRepository();

/**
 * @typedef {import("@prisma/client").LPAStatementSubmission} LPAStatementSubmission
 * @typedef {import('./repo').DocumentUploadData} DocumentUploadData
 */

/**
 * Create a SubmissionDocumentUpload entry
 *
 * @param {string} caseReference
 * @param {DocumentUploadData} uploadData
 * @return {Promise<LPAStatementSubmission|null>}
 */
async function createSubmissionDocument(caseReference, uploadData) {
	const updatedStatement = repo.createSubmissionDocument(caseReference, uploadData);

	if (!updatedStatement) {
		return null;
	}

	return updatedStatement;
}

/**
 * Delete a SubmissionDocumentUpload entry
 *
 * @param {string} caseReference
 * @param {string} documentId
 * @return {Promise<LPAStatementSubmission|null>}
 */
async function deleteSubmissionDocument(caseReference, documentId) {
	const updatedStatement = repo.deleteSubmissionDocument(caseReference, documentId);

	if (!updatedStatement) {
		return null;
	}

	return updatedStatement;
}

module.exports = {
	createSubmissionDocument,
	deleteSubmissionDocument
};
