const { SubmissionDocumentUploadRepository } = require('./repo');

const repo = new SubmissionDocumentUploadRepository();

/**
 * @typedef {import('@pins/database/src/client/client').LPAFinalCommentSubmission} LPAFinalCommentSubmission
 * @typedef {import('./repo').DocumentUploadData} DocumentUploadData
 */

/**
 * Create a SubmissionDocumentUpload entry
 *
 * @param {string} caseReference
 * @param {DocumentUploadData[]} uploadData
 * @return {Promise<LPAFinalCommentSubmission|null>}
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
 * @param {string[]} documentIds
 * @return {Promise<LPAFinalCommentSubmission|null>}
 */
async function deleteSubmissionDocument(caseReference, documentIds) {
	const updatedStatement = repo.deleteSubmissionDocument(caseReference, documentIds);

	if (!updatedStatement) {
		return null;
	}

	return updatedStatement;
}

module.exports = {
	createSubmissionDocument,
	deleteSubmissionDocument
};
