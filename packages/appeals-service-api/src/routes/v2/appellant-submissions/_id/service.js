const ApiError = require('#errors/apiError');
const Repo = require('../repo');
const repo = new Repo();

/**
 * @typedef {import('@prisma/client').AppellantSubmission} AppellantSubmission
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionUpdateInput} AppellantSubmissionUpdateInput
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionGetPayload<{
 *   include: {
 *     SubmissionDocumentUpload: true,
 *     SubmissionAddress: true,
 *     SubmissionLinkedCase: true,
 * 		 SubmissionListedBuilding: true,
 *		 Appeal: {
 *       include: {
 *			   Users: true
 *		   }
 *     }
 *   }
 * }>} FullAppellantSubmission
 */

/**
 * @param {{ appellantSubmissionId: string, userId: string }} params
 * @return {Promise<AppellantSubmission>}
 */
exports.get = async ({ appellantSubmissionId, userId }) => {
	const submission = await repo.get({ appellantSubmissionId, userId });

	if (!submission) throw ApiError.appellantSubmissionNotFound(appellantSubmissionId);

	return submission;
};

/**
 * @param {{ appellantSubmissionId: string, userId: string, data: AppellantSubmissionUpdateInput }} params
 * @return {Promise<AppellantSubmission>}
 */
exports.patch = async ({ appellantSubmissionId, userId, data }) => {
	const submission = await repo.patch({ appellantSubmissionId, userId, data });

	if (!submission) throw ApiError.appellantSubmissionNotFound(appellantSubmissionId);

	return submission;
};

/**
 * mark appeal as submitted to back office
 * @param {string} appealId
 * @return {Promise<{id: string}>}
 */
exports.markAppealAsSubmitted = (appealId) => {
	return repo.markAppealAsSubmitted(appealId);
};

/**
 * @param {{ appellantSubmissionId: string, userId: string }} params
 * @return {Promise<FullAppellantSubmission>}
 */
exports.getForBOSubmission = async ({ appellantSubmissionId, userId }) => {
	const submission = await repo.getForBOSubmission({ appellantSubmissionId, userId });

	if (!submission) throw ApiError.appellantSubmissionNotFound(appellantSubmissionId);

	return submission;
};

/**
 * @param {{ appellantSubmissionId: string, userId: string }} params
 * @return {Promise<boolean>}
 */
exports.confirmOwnership = async ({ appellantSubmissionId, userId }) => {
	try {
		return await repo.userOwnsAppealSubmission({ appellantSubmissionId, userId });
	} catch (err) {
		throw ApiError.forbidden();
	}
};
