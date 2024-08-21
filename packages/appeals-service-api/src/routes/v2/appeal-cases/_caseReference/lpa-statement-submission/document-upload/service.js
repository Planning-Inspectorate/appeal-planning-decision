const { SubmissionDocumentUploadRepository } = require('./repo');

const repo = new SubmissionDocumentUploadRepository();

/**
 * @typedef {import("@prisma/client").LPAStatementSubmission} LPAStatementSubmission
 * @typedef {import('./repo').DocumentUploadData} DocumentUploadData
 */

/**
 * Create a SubmissionDocumentUpload entry
 *
 * @param {string} id
 * @param {DocumentUploadData} uploadData
 * @return {Promise<LPAStatementSubmission|null>}
 */
async function createSubmissionDocument(id, uploadData) {
	const updatedStatement = repo.createSubmissionDocument(id, uploadData);

	if (!updatedStatement) {
		return null;
	}

	return updatedStatement;
}

/**
 * Delete a SubmissionDocumentUpload entry
 *
 * @param {string} id
 * @param {string} documentId
 * @return {Promise<LPAStatementSubmission|null>}
 */
async function deleteSubmissionDocument(id, documentId) {
	const updatedStatement = repo.deleteSubmissionDocument(id, documentId);

	if (!updatedStatement) {
		return null;
	}

	return updatedStatement;
}

module.exports = {
	createSubmissionDocument,
	deleteSubmissionDocument
};
