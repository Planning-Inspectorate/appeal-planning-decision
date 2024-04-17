const Repo = require('./repo');
const repo = new Repo();

/**
 * @typedef {import('@prisma/client').AppellantSubmission} AppellantSubmission
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionCreateInput} AppellantSubmissionCreateInput
 */

/**
 * @param {{ userId: string, data: AppellantSubmissionCreateInput }} params
 * @return {Promise<AppellantSubmission>}
 */
exports.put = async ({ userId, data }) => {
	return await repo.put({ userId, data });
};

/**
 * @param {{ userId: string, data: AppellantSubmissionCreateInput }} params
 * @return {Promise<AppellantSubmission>}
 */
exports.post = async ({ userId, data }) => {
	return await repo.post({ userId, data });
};
