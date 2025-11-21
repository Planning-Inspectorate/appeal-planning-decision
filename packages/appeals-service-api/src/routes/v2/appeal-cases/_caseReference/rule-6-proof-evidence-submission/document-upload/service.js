const { SubmissionDocumentUploadRepository } = require('./repo');

const repo = new SubmissionDocumentUploadRepository();

/**
 * @typedef {import('@pins/database/src/client').Rule6ProofOfEvidenceSubmission} Rule6ProofOfEvidenceSubmission
 * @typedef {import('./repo').DocumentUploadData} DocumentUploadData
 */

/**
 * Create a SubmissionDocumentUpload entry
 *
 * @param {string | undefined} userId
 * @param {string} caseReference
 * @param {DocumentUploadData[]} uploadData
 * @return {Promise<Rule6ProofOfEvidenceSubmission|null>}
 */
async function createSubmissionDocument(userId, caseReference, uploadData) {
	if (!userId) {
		return null;
	}

	const updatedProofs = repo.createSubmissionDocument(userId, caseReference, uploadData);

	if (!updatedProofs) {
		return null;
	}

	return updatedProofs;
}

/**
 * Delete a SubmissionDocumentUpload entry
 *
 * @param {string|undefined} userId
 * @param {string} caseReference
 * @param {string[]} documentIds
 * @return {Promise<Rule6ProofOfEvidenceSubmission|null>}
 */
async function deleteSubmissionDocument(userId, caseReference, documentIds) {
	if (!userId) {
		return null;
	}

	const updatedProofs = repo.deleteSubmissionDocument(userId, caseReference, documentIds);

	if (!updatedProofs) {
		return null;
	}

	return updatedProofs;
}

module.exports = {
	createSubmissionDocument,
	deleteSubmissionDocument
};
