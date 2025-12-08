const { SubmissionAppealGroundRepository } = require('./repo');

const appealGroundRepo = new SubmissionAppealGroundRepository();

/**
 * @typedef {import('@pins/database/src/client').AppellantSubmission} AppellantSubmission
 * @typedef {import('./repo').AppealGroundData} AppealGroundData
 */

/**
 * Create a SubmissionAppealGround entry
 *
 * @param {string} appellantSubmissionId
 * @param {AppealGroundData} uploadData
 * @return {Promise<AppellantSubmission|null>}
 */
async function createAppealGround(appellantSubmissionId, uploadData) {
	const updatedSubmission = await appealGroundRepo.createAppealGround(
		appellantSubmissionId,
		uploadData
	);

	if (!updatedSubmission) {
		return null;
	}

	return updatedSubmission;
}

/**
 * Delete a SubmissionAppealGround entry
 *
 * @param {string} appellantSubmissionId
 * @param {string} appealGroundId
 * @return {Promise<AppellantSubmission|null>}
 */
async function deleteAppealGround(appellantSubmissionId, appealGroundId) {
	const updatedSubmission = await appealGroundRepo.deleteAppealGround(
		appellantSubmissionId,
		appealGroundId
	);

	if (!updatedSubmission) {
		return null;
	}

	return updatedSubmission;
}

module.exports = {
	createAppealGround,
	deleteAppealGround
};
