const { APPEAL_STATE } = require('@pins/business-rules/src/constants');
const { UserAppealsRepository } = require('./repo');
const { AppealsRepository } = require('#repositories/appeals-repository');
const { filterNotNull } = require('#lib/filter');
const { appendLinkedCasesForMultipleAppeals } = require('../appeal-cases/service');
const {
	addOwnershipAndSubmissionDetailsToRepresentations
} = require('@pins/common/src/access/representation-ownership');
const { getServiceUsersWithEmailsByIdAndCaseReference } = require('../service-users/service');

const repo = new UserAppealsRepository();
const cosmosAppeals = new AppealsRepository();

/**
 * @typedef {import('@pins/database/src/client/client').AppealCase} AppealCase
 * // TODO: define type for submission (ideally generated from spec)
 * @typedef {AppealCase | any} AppealCaseOrSubmission
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 * @typedef {import('@pins/database/src/client/client').Prisma.AppealCreateInput} AppealCreateInput
 * @typedef {import('@pins/database/src/client/client').Appeal} Appeal
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

	await Promise.all(
		enhancedCases.map(async (appealCase) => {
			if (appealCase.Representations && appealCase.Representations.length > 0) {
				const serviceUserIds = [
					...new Set(appealCase.Representations.map((r) => r.serviceUserId).filter(Boolean))
				];
				const usersWithEmails = await getServiceUsersWithEmailsByIdAndCaseReference(
					serviceUserIds,
					appealCase.caseReference
				);
				appealCase.Representations = addOwnershipAndSubmissionDetailsToRepresentations(
					appealCase.Representations,
					user.email,
					false,
					usersWithEmails
				);
			}
		})
	);

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

/**
 * create an appeal
 *
 * @param {AppealCreateInput} data
 * @return {Promise<Appeal>}
 */
async function createAppeal(data) {
	return await repo.create({ data });
}

module.exports = {
	getAppealsForUser,
	createAppeal
};
