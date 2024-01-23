const { UserAppealSubmissionRepository } = require('./repo');
const { AppealsRepository } = require('#repositories/appeals-repository');

const repo = new UserAppealSubmissionRepository();
const cosmosAppeals = new AppealsRepository();

/**
 * @typedef {import("@prisma/client").AppealCase} AppealCase
 * @typedef {import('appeals-service-api').Api.AppealSubmission} AppealSubmission
 */

/**
 * @param {{ userId: string, appealSubmissionId: string }} params
 * @return {Promise<AppealSubmission[]|null>}
 */
async function getAppealSubmissionForUser(params) {
	const appeal = await repo.getAppealSubmissionForUser(params);
	if (!appeal || !appeal.Users[0]) {
		return null;
	}

	return cosmosAppeals.getById(params.appealSubmissionId);
}

module.exports = {
	getAppealSubmissionForUser
};
