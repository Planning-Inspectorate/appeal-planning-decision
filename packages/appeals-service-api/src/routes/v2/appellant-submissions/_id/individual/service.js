const { SubmissionIndividualRepository } = require('./repo');

const individualRepo = new SubmissionIndividualRepository();

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
	const updatedSubmission = await individualRepo.createIndividual(
		appellantSubmissionId,
		uploadData
	);

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
	const updatedSubmission = await individualRepo.deleteIndividual(
		appellantSubmissionId,
		individualId
	);

	if (!updatedSubmission) {
		return null;
	}

	return updatedSubmission;
}

module.exports = {
	createIndividual,
	deleteIndividual
};
