const { SubmissionNeighbourAddressRepository } = require('./repo');

const repo = new SubmissionNeighbourAddressRepository();

/**
 * @typedef {import("@prisma/client").SubmissionNeighbourAddress} SubmissionNeighbourAddress
 */

/**
 * get SubmissionNeighbourAddress entries associated with specified questionnaire
 *
 * @param {string} questionnaireId
 * @return {Promise<SubmissionNeighbourAddress[]|null>}
 */
async function getNeighbourAddresses(questionnaireId) {
	const uploadedAddresses = repo.getNeighbourAddresses(questionnaireId);

	if (!uploadedAddresses) {
		return null;
	}

	return uploadedAddresses;
}

/**
 * Create a SubmissionNeighbourAddress entry
 *
 * @param {object} uploadData
 * @return {Promise<SubmissionNeighbourAddress|null>}
 */
async function createNeighbourAddress(uploadData) {
	const uploadedAddress = repo.createNeighbourAddress(uploadData);

	if (!uploadedAddress) {
		return null;
	}

	return uploadedAddress;
}

module.exports = {
	getNeighbourAddresses,
	createNeighbourAddress
};
