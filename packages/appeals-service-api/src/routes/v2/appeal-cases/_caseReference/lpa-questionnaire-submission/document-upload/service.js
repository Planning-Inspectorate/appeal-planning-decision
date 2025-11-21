const { SubmissionDocumentUploadRepository } = require('./repo');

const repo = new SubmissionDocumentUploadRepository();

/**
 * @typedef {import('@pins/database/src/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('./repo').DocumentUploadData} DocumentUploadData
 */

/**
 * Create a SubmissionDocumentUpload entry
 *
 * @param {string} caseReference
 * @param {DocumentUploadData[]} uploadData
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function createSubmissionDocument(caseReference, uploadData) {
	const updatedQuestionnaire = repo.createSubmissionDocument(caseReference, uploadData);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

/**
 * Delete a SubmissionDocumentUpload entry
 *
 * @param {string} caseReference
 * @param {string[]} documentIds
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function deleteSubmissionDocument(caseReference, documentIds) {
	const updatedQuestionnaire = repo.deleteSubmissionDocument(caseReference, documentIds);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

module.exports = {
	createSubmissionDocument,
	deleteSubmissionDocument
};
