const { RepresentationsRepository } = require('./repo');
const { appendAppellantAndAgent } = require('../../service');
const { REPRESENTATION_TYPES } = require('@pins/common/src/constants');
const { getServiceUsersWithEmailsByIdAndCaseReference } = require('../../../service-users/service');
const { APPEAL_SOURCE } = require('pins-data-model');
const repo = new RepresentationsRepository();

/**
 * @typedef {import('@prisma/client').AppealCase} AppealCase
 * @typedef {import('@prisma/client').Representation} Representation
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
async function addOwnershipDetailsToRepresentations(representations, caseReference, email, isLpa) {
	//lpa ownership
	if (isLpa) {
		return representations.map((rep) => ({
			...rep,
			userOwnsRepresentation: rep.source === APPEAL_SOURCE.LPA
		}));
	}

	// rule 6 and appellant ownership

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
		userOwnsRepresentation: loggedInUserIds.has(rep.serviceUserId)
	}));
}

module.exports = {
	getAppealCaseWithAllRepresentations,
	getAppealCaseWithRepresentationsByType,
	addOwnershipDetailsToRepresentations
};
