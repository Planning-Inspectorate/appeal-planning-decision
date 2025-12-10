const { SubmissionIndividualRepository } = require('./repo');

const addressRepo = new SubmissionIndividualRepository();

/**
 * @typedef {import('@pins/database/src/client/client').AppellantSubmission} AppellantSubmission
 * @typedef {import('./repo').IndividualData} IndividualData
 */

/**
 * Create a SubmissionIndividual entry
 *
 * @param {string} appellantSubmissionId
 * @param {IndividualData} uploadData
 * @return {Promise<AppellantSubmission|null>}
 */
async function createIndividual(appellantSubmissionId, uploadData) {
	const updatedSubmission = addressRepo.createIndividual(appellantSubmissionId, uploadData);

	if (!updatedSubmission) {
		return null;
	}

	return updatedSubmission;
}

/**
 * Delete a SubmissionIndividual entry
 *
 * @param {string} appellantSubmissionId
 * @param {string} individualId
 * @return {Promise<AppellantSubmission|null>}
 */
async function deleteIndividual(appellantSubmissionId, individualId) {
	const updatedSubmission = addressRepo.deleteIndividual(appellantSubmissionId, individualId);

	if (!updatedSubmission) {
		return null;
	}

	return updatedSubmission;
}

module.exports = {
	createIndividual,
	deleteIndividual
};
