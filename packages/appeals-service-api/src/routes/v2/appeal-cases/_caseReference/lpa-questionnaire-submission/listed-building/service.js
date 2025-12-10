const { LinkedCaseRepository } = require('./repo');

const repo = new LinkedCaseRepository();

/**
 * @typedef {import('@pins/database/src/client/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('./repo').ListedBuilding} ListedBuilding
 */

/**
 * Create a SubmissionLinkedCase entry
 *
 * @param {string} caseReference
 * @param {ListedBuilding} uploadData
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function createListedBuilding(caseReference, uploadData) {
	const updatedQuestionnaire = repo.createListedBuilding(caseReference, uploadData);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

/**
 * Delete a SubmissionLinkedCase entry
 *
 * @param {string} caseReference
 * @param {string} listedId
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function deleteListedBuilding(caseReference, listedId) {
	const updatedQuestionnaire = repo.deleteListedBuilding(caseReference, listedId);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

module.exports = {
	createListedBuilding,
	deleteListedBuilding
};
