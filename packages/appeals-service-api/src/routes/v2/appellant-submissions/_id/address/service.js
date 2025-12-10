const { SubmissionAddressRepository } = require('./repo');

const addressRepo = new SubmissionAddressRepository();

/**
 * @typedef {import('@pins/database/src/client/client').AppellantSubmission} AppellantSubmission
 * @typedef {import('./repo').AddressData} AddressData
 */

/**
 * Create a SubmissionAddress entry
 *
 * @param {string} appellantSubmissionId
 * @param {AddressData} uploadData
 * @return {Promise<AppellantSubmission|null>}
 */
async function createAddress(appellantSubmissionId, uploadData) {
	const updatedSubmission = addressRepo.createAddress(appellantSubmissionId, uploadData);

	if (!updatedSubmission) {
		return null;
	}

	return updatedSubmission;
}

/**
 * Delete a SubmissionAddress entry
 *
 * @param {string} appellantSubmissionId
 * @param {string} addressId
 * @return {Promise<AppellantSubmission|null>}
 */
async function deleteAddress(appellantSubmissionId, addressId) {
	const updatedSubmission = addressRepo.deleteAddress(appellantSubmissionId, addressId);

	if (!updatedSubmission) {
		return null;
	}

	return updatedSubmission;
}

module.exports = {
	createAddress,
	deleteAddress
};
