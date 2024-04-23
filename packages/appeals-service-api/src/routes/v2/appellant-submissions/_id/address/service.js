const { SubmissionAddressRepository } = require('./repo');

const repo = new SubmissionAddressRepository();

/**
 * @typedef {import("@prisma/client").AppellantSubmission} AppellantSubmission
 * @typedef {import('./repo').AddressData} AddressData
 */

/**
 * Create a SubmissionAddress entry
 *
 * @param {string} id
 * @param {AddressData} uploadData
 * @return {Promise<AppellantSubmission|null>}
 */
async function createAddress(id, uploadData) {
	const updatedSubmission = repo.createAddress(id, uploadData);

	if (!updatedSubmission) {
		return null;
	}

	return updatedSubmission;
}

/**
 * Delete a SubmissionAddress entry
 *
 * @param {string} id
 * @param {string} addressId
 * @return {Promise<AppellantSubmission|null>}
 */
async function deleteAddress(id, addressId) {
	const updatedSubmission = repo.deleteAddress(id, addressId);

	if (!updatedSubmission) {
		return null;
	}

	return updatedSubmission;
}

module.exports = {
	createAddress,
	deleteAddress
};
