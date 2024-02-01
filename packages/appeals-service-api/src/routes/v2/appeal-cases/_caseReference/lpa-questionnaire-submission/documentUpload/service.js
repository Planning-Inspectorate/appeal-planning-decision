const { SubmissionDocumentUploadRepository } = require('./repo');

const repo = new SubmissionDocumentUploadRepository();

/**
 * @typedef {import("@prisma/client").SubmissionDocumentUpload} SubmissionDocumentUpload
 */

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
	createSubmissionDocument
};
