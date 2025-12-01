const { LinkedCaseRepository } = require('./repo');

const repo = new LinkedCaseRepository();

/**
 * @typedef {import('@pins/database/src/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('./repo').LinkedCaseData} LinkedCaseData
 */

/**
 * Create a SubmissionLinkedCase entry
 *
 * @param {string} caseReference
 * @param {LinkedCaseData} uploadData
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function createLinkedAppeal(caseReference, uploadData) {
	const updatedQuestionnaire = repo.createLinkedCase(caseReference, uploadData);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

/**
 * Delete a SubmissionLinkedCase entry
 *
 * @param {string} caseReference
 * @param {string} linkedCaseId
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function deleteLinkedAppeal(caseReference, linkedCaseId) {
	const updatedQuestionnaire = repo.deleteLinkedCase(caseReference, linkedCaseId);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

module.exports = {
	createLinkedAppeal,
	deleteLinkedAppeal
};
