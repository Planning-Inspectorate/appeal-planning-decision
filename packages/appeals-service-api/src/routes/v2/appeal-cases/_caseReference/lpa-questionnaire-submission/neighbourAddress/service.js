const { SubmissionNeighbourAddressRepository } = require('./repo');

const repo = new SubmissionNeighbourAddressRepository();

/**
 * @typedef {import("@prisma/client").SubmissionNeighbourAddress} SubmissionNeighbourAddress
 */

/**
 * Create a SubmissionNeighbourAddress entry
 *
 * @param {object} uploadData
 * @return {Promise<SubmissionNeighbourAddress|null>}
 */
async function createNeighbourAddress(uploadData) {
	const uploadedDocument = repo.createNeighbourAddress(uploadData);

	if (!uploadedDocument) {
		return null;
	}

	return uploadedDocument;
}

module.exports = {
	createNeighbourAddress
};
