const { RepresentationsRepository } = require('./repo');
const { appendAppellantAndAgent } = require('../../service');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');
const ApiError = require('#errors/apiError');
const {
	REPRESENTATION_TYPES,
	LPA_USER_ROLE,
	APPEAL_USER_ROLES
} = require('@pins/common/src/constants');
const { getServiceUsersWithEmailsByIdAndCaseReference } = require('../../../service-users/service');
const { APPEAL_SOURCE } = require('pins-data-model');
const repo = new RepresentationsRepository();

const { SchemaValidator } = require('../../../../../services/back-office-v2/validate');
const { getValidator } = new SchemaValidator();

/**
 * @template Payload
 * @typedef {import('../../../../../services/back-office-v2/validate').Validate<Payload>} Validate
 */

/**
 * @typedef {import('@prisma/client').AppealCase} AppealCase
 * @typedef {import('@prisma/client').Representation} Representation
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 * @typedef { 'LPAUser' } LpaUserRole
 * @typedef {import ('pins-data-model').Schemas.AppealRepresentation} AppealRepresentation
 */

/**
 *
 * @param {string} caseReference
 * @returns {Promise<AppealCase|null>}
 */
async function getAppealCaseWithAllRepresentations(caseReference) {
	const appealCaseWithRepresentations = await repo.getAppealCaseWithAllRepresentations(
		caseReference
	);

	// @ts-ignore
	const appealCaseWithApplicant = await appendAppellantAndAgent(appealCaseWithRepresentations);

	return appealCaseWithApplicant;
}

/**
 *
 * @param {string} caseReference
 * @param {string} type
 * @returns {Promise<AppealCase|null>}
 */
async function getAppealCaseWithRepresentationsByType(caseReference, type) {
	const appealCaseWithRepresentations = await repo.getAppealCaseWithRepresentationsByType(
		caseReference,
		type
	);

	// @ts-ignore
	const appealCaseWithApplicant = await appendAppellantAndAgent(appealCaseWithRepresentations);

	return appealCaseWithApplicant;
}

/**
 *
 * @param {Representation[]} representations
 * @param {string} caseReference
 * @param {string} email
 * @param {boolean} isLpa
 * @returns {Promise<Representation[]>}
 */
async function addOwnershipAndSubmissionDetailsToRepresentations(
	representations,
	caseReference,
	email,
	isLpa
) {
	// get unique list of service user ids for any non-ip comment representations
	// ip comments are ignored as they have no associated login and so ownership always false
	//
	const serviceUserIds = new Set(
		representations
			.filter(
				(rep) =>
					rep.serviceUserId &&
					rep.representationType !== REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
			)
			.map((rep) => rep.serviceUserId)
			.filter(Boolean)
	);

	// call to service user repo, return serviceUserId and email if id is serviceUserIds array.
	const serviceUsersWithEmails = await getServiceUsersWithEmailsByIdAndCaseReference(
		[...serviceUserIds],
		caseReference
	);

	// find the service user ids that have matching email with logged in user
	const loggedInUserIds = new Set(
		serviceUsersWithEmails
			.filter((serviceUser) => serviceUser.emailAddress == email)
			.map((serviceUser) => serviceUser.id)
	);

	// map userOwnsRepresentation onto the representations based on the logged in user
	return representations.map((rep) => ({
		...rep,
		userOwnsRepresentation:
			(isLpa && rep.source === APPEAL_SOURCE.LPA) || loggedInUserIds.has(rep.serviceUserId),
		submittingPartyType: ascertainSubmittingParty(rep, serviceUsersWithEmails)
	}));
}

/**
 *
 * @param {Representation} representation
 * @param {import('pins-data-model/src/schemas').ServiceUser[]} serviceUsersWithEmails
 * @returns {LpaUserRole | AppealToUserRoles | undefined}
 */
function ascertainSubmittingParty(representation, serviceUsersWithEmails) {
	if (representation.representationType === REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT)
		return APPEAL_USER_ROLES.INTERESTED_PARTY;

	if (representation.source === APPEAL_SOURCE.LPA) return LPA_USER_ROLE;

	return serviceUsersWithEmails.find((user) => user.id === representation.serviceUserId)
		?.serviceUserType;
}

/**
 * Put a representation by representation id
 *
 * @param {string} representationId
 * @param {AppealRepresentation} data
 * @returns {Promise<Representation>}
 */
async function putRepresentation(representationId, data) {
	try {
		/** @type {Validate<AppealRepresentation>} */
		const representationValidator = getValidator('appeal-representation');

		if (!representationValidator(data)) {
			throw ApiError.badRequest('Payload was invalid');
		}

		const result = await repo.putRepresentationByRepresentationId(representationId, data);

		return result;
	} catch (err) {
		if (err instanceof PrismaClientValidationError) {
			throw ApiError.badRequest(err.message);
		}
		throw err;
	}
}

module.exports = {
	getAppealCaseWithAllRepresentations,
	getAppealCaseWithRepresentationsByType,
	addOwnershipAndSubmissionDetailsToRepresentations,
	putRepresentation
};
