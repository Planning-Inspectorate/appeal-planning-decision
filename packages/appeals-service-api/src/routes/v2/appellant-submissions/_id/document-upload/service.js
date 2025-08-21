const { SubmissionDocumentUploadRepository } = require('./repo');

const repo = new SubmissionDocumentUploadRepository();

/**
 * @typedef {import("@prisma/client").AppellantSubmission} AppellantSubmission
 * @typedef {import('./repo').DocumentUploadData} DocumentUploadData
 */

/**
 * Create a SubmissionDocumentUpload entry
 *
 * @param {string} id
 * @param {DocumentUploadData[]} uploadData
 * @return {Promise<AppellantSubmission|null>}
 */
async function createSubmissionDocument(id, uploadData) {
	const updatedQuestionnaire = repo.createSubmissionDocument(id, uploadData);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

/**
 * Delete a SubmissionDocumentUpload entry
 *
 * @param {string} id
 * @param {string[]} documentIds
 * @return {Promise<AppellantSubmission|null>}
 */
async function deleteSubmissionDocument(id, documentIds) {
	const updatedQuestionnaire = repo.deleteSubmissionDocument(id, documentIds);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

module.exports = {
	createSubmissionDocument,
	deleteSubmissionDocument
};
