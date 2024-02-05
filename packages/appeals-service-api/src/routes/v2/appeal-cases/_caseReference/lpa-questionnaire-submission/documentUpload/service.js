const { SubmissionDocumentUploadRepository } = require('./repo');

const repo = new SubmissionDocumentUploadRepository();

/**
 * @typedef {import("@prisma/client").SubmissionDocumentUpload} SubmissionDocumentUpload
 */

/**
 * Get all SubmissionDocumentUpload entries for a specified questionnaire
 *
 * @param {string} questionnaireId
 * @return {Promise<SubmissionDocumentUpload[]|null>}
 */
async function getDocumentUploads(questionnaireId) {
	const uploadedDocument = repo.getDocumentUploads(questionnaireId);

	if (!uploadedDocument) {
		return null;
	}

	return uploadedDocument;
}

/**
 * Create a SubmissionDocumentUpload entry
 *
 * @param {object} uploadData
 * @return {Promise<SubmissionDocumentUpload|null>}
 */
async function createSubmissionDocument(uploadData) {
	const uploadedDocument = repo.createSubmissionDocument(uploadData);

	if (!uploadedDocument) {
		return null;
	}

	return uploadedDocument;
}

module.exports = {
	createSubmissionDocument,
	getDocumentUploads
};
