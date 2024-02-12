const { SubmissionNeighbourAddressRepository } = require('./repo');

const repo = new SubmissionNeighbourAddressRepository();

/**
 * @typedef {import("@prisma/client").LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('./repo').NeighbourAddressData} NeighbourAddressData
 */

/**
 * Create a SubmissionNeighbourAddress entry
 *
 * @param {string} caseReference
 * @param {NeighbourAddressData} uploadData
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function createNeighbourAddress(caseReference, uploadData) {
	const updatedQuestionnaire = repo.createNeighbourAddress(caseReference, uploadData);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

module.exports = {
	createNeighbourAddress
};
