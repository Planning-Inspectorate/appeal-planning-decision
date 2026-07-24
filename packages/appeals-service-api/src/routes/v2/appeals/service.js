const ApiError = require('#errors/apiError');
const { APPEAL_STATE } = require('@pins/business-rules/src/constants');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');
const { UserAppealsRepository } = require('./repo');
const { AppealsRepository } = require('#repositories/appeals-repository');
const { filterNotNull } = require('#lib/filter');
const { appendLinkedCasesForMultipleAppeals } = require('../appeal-cases/service');
const {
	addOwnershipAndSubmissionDetailsToRepresentations
} = require('@pins/common/src/access/representation-ownership');
const { getServiceUsersForMultipleCases } = require('../service-users/service');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

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

	const isAppellantOrAgent =
		role === APPEAL_USER_ROLES.APPELLANT || role === APPEAL_USER_ROLES.AGENT;

	// find v1 draft submissions
	const draftSubmissionIds = !isAppellantOrAgent
		? []
		: user.Appeals.filter(
				(appealToUser) =>
					appealToUser.Appeal?.legacyAppealSubmissionId &&
					appealToUser.Appeal?.legacyAppealSubmissionState === APPEAL_STATE.DRAFT
			)
				.map((appealToUser) => appealToUser.Appeal?.legacyAppealSubmissionId)
				.filter(filterNotNull);

	// find v2 draft submissions
	const v2Drafts = !isAppellantOrAgent
		? []
		: user.Appeals.filter(
				(appealToUser) => appealToUser.Appeal?.AppellantSubmission?.submitted === false
			).map((appealToUser) => appealToUser.Appeal);

	// find appeal cases
	const cases = user.Appeals.map((appealToUser) => appealToUser.Appeal?.AppealCase).filter(
		filterNotNull
	);

	// check for linked cases
	const enhancedCases = await appendLinkedCasesForMultipleAppeals(cases);

	// cases with representations
	const lookups = enhancedCases
		.filter((appealCase) => appealCase.Representations && appealCase.Representations.length > 0)
		.map((appealCase) => appealCase.caseReference);

	const allServiceUsers = await getServiceUsersForMultipleCases(
		lookups,
		{
			id: true,
			emailAddress: true,
			serviceUserType: true,
			organisation: true,
			caseReference: true
		},
		[SERVICE_USER_TYPE.APPELLANT, SERVICE_USER_TYPE.AGENT, SERVICE_USER_TYPE.RULE_6_PARTY]
	);

	enhancedCases.forEach((appealCase) => {
		if (appealCase.Representations && appealCase.Representations.length > 0) {
			const usersByCase = allServiceUsers.filter(
				(result) => result.caseReference === appealCase.caseReference
			);

			appealCase.Representations = addOwnershipAndSubmissionDetailsToRepresentations(
				appealCase.Representations,
				user.email,
				false,
				usersByCase
			);
		}
	});

	// fetch drafts from Cosmos
	const draftSubmissions = !isAppellantOrAgent
		? []
		: await Promise.all(draftSubmissionIds.map((id) => cosmosAppeals.getById(id)));

	// return all cases + drafts
	return [
		...enhancedCases,
		...v2Drafts,
		// any drafts that aren't found in cosmos will be null, filter those outs
		...draftSubmissions.filter(filterNotNull)
	];
}

/**
 * Get an appeal draft
 *
 * @param {string} userId
 * @param {string} appealId
 * @return {Promise<UserWithAppeals|null>}
 */
async function getAppealDraft(userId, appealId) {
	const user = await repo.getAppealDraft(userId, appealId);

	if (!user) {
		throw ApiError.forbidden();
	}

	if (!user.Appeals || user.Appeals.length === 0) {
		throw ApiError.appealNotFound(appealId);
	}

	const draftSubmissionIds = user.Appeals.filter(
		(appealToUser) =>
			appealToUser.Appeal?.legacyAppealSubmissionId &&
			appealToUser.Appeal?.legacyAppealSubmissionState === APPEAL_STATE.DRAFT
	)
		.map((appealToUser) => appealToUser.Appeal?.legacyAppealSubmissionId)
		.filter(filterNotNull);

	if (draftSubmissionIds.length) {
		return await cosmosAppeals.getById(draftSubmissionIds[0]);
	}

	// find v2 draft submissions
	const v2Drafts = user.Appeals.filter(
		(appealToUser) => appealToUser.Appeal?.AppellantSubmission?.submitted === false
	).map((appealToUser) => appealToUser.Appeal);

	if (v2Drafts.length) {
		return v2Drafts[0];
	}

	throw ApiError.appealNotFound(appealId);
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
	getAppealDraft,
	createAppeal
};
