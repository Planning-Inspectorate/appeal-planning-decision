const { SubmissionAddressRepository } = require('./repo');

const repo = new SubmissionAddressRepository();

/**
 * @typedef {import('@pins/database/src/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('./repo').AddressData} AddressData
 */

/**
 * Create a SubmissionAddress entry
 *
 * @param {string} caseReference
 * @param {AddressData} uploadData
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function createAddress(caseReference, uploadData) {
	const updatedQuestionnaire = repo.createAddress(caseReference, uploadData);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

/**
 * Delete a SubmissionAddress entry
 *
 * @param {string} caseReference
 * @param {string} addressId
 * @return {Promise<LPAQuestionnaireSubmission|null>}
 */
async function deleteAddress(caseReference, addressId) {
	const updatedQuestionnaire = repo.deleteAddress(caseReference, addressId);

	if (!updatedQuestionnaire) {
		return null;
	}

	return updatedQuestionnaire;
}

module.exports = {
	createAddress,
	deleteAddress
};
