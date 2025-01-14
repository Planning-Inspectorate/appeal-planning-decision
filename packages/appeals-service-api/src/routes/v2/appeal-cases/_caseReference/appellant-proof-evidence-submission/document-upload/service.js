const { SubmissionDocumentUploadRepository } = require('./repo');

const repo = new SubmissionDocumentUploadRepository();

/**
 * @typedef {import("@prisma/client").AppellantProofOfEvidenceSubmission} AppellantProofOfEvidenceSubmission
 * @typedef {import('./repo').DocumentUploadData} DocumentUploadData
 */

/**
 * Create a SubmissionDocumentUpload entry
 *
 * @param {string} caseReference
 * @param {DocumentUploadData} uploadData
 * @return {Promise<AppellantProofOfEvidenceSubmission|null>}
 */
async function createSubmissionDocument(caseReference, uploadData) {
	const updatedProofs = repo.createSubmissionDocument(caseReference, uploadData);

	if (!updatedProofs) {
		return null;
	}

	return updatedProofs;
}

/**
 * Delete a SubmissionDocumentUpload entry
 *
 * @param {string} caseReference
 * @param {string} documentId
 * @return {Promise<AppellantProofOfEvidenceSubmission|null>}
 */
async function deleteSubmissionDocument(caseReference, documentId) {
	const updatedProofs = repo.deleteSubmissionDocument(caseReference, documentId);

	if (!updatedProofs) {
		return null;
	}

	return updatedProofs;
}

module.exports = {
	createSubmissionDocument,
	deleteSubmissionDocument
};
