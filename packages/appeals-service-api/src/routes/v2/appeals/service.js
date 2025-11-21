const { APPEAL_STATE } = require('@pins/business-rules/src/constants');
const { UserAppealsRepository } = require('./repo');
const { AppealsRepository } = require('#repositories/appeals-repository');
const { filterNotNull } = require('#lib/filter');
const { appendLinkedCasesForMultipleAppeals } = require('../appeal-cases/service');

const repo = new UserAppealsRepository();
const cosmosAppeals = new AppealsRepository();

/**
 * @typedef {import('@pins/database/src/client').AppealCase} AppealCase
 * // TODO: define type for submission (ideally generated from spec)
 * @typedef {AppealCase | any} AppealCaseOrSubmission
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 */

/**
 * Get all appeals for a user - both cases and draft submissions
 *
 * @param {string} userId
 * @param {AppealToUserRoles} role
 * @return {Promise<AppealCaseOrSubmission[]|null>}
 */
async function getAppealsForUser(userId, role) {
	const user = await repo.listAppealsForUser(userId, role);
	if (!user) {
		return null;
	}

	// find v1 draft submissions
	const draftSubmissionIds = user.Appeals.filter(
		(appealToUser) =>
			appealToUser.Appeal?.legacyAppealSubmissionId &&
			appealToUser.Appeal?.legacyAppealSubmissionState === APPEAL_STATE.DRAFT
	)
		.map((appealToUser) => appealToUser.Appeal?.legacyAppealSubmissionId)
		.filter(filterNotNull);

	// find v2 draft submissions
	const v2Drafts = user.Appeals.filter(
		(appealToUser) => appealToUser.Appeal?.AppellantSubmission?.submitted === false
	).map((appealToUser) => appealToUser.Appeal);

	// find appeal cases
	const cases = user.Appeals.map((appealToUser) => appealToUser.Appeal?.AppealCase).filter(
		filterNotNull
	);

	// check for linked cases
	const enhancedCases = await appendLinkedCasesForMultipleAppeals(cases);

	// fetch drafts from Cosmos
	const draftSubmissions = await Promise.all(
		draftSubmissionIds.map((id) => cosmosAppeals.getById(id))
	);

	// return all cases + drafts
	return [
		...enhancedCases,
		...v2Drafts,
		// any drafts that aren't found in cosmos will be null, filter those outs
		...draftSubmissions.filter(filterNotNull)
	];
}

module.exports = {
	getAppealsForUser
};
