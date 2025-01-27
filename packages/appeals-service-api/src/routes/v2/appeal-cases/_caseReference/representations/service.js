const { RepresentationsRepository } = require('./repo');
const { appendAppellantAndAgent } = require('../../service');
const { REPRESENTATION_TYPES } = require('@pins/common/src/constants');
const {
	getServiceUsersWithEmailsByIdAndCaseReference
} = require('src/routes/v2/service-users/service');
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
		return representations.reduce((acc, currentRepresentation) => {
			if (currentRepresentation.source == 'lpa') {
				acc.push({
					...currentRepresentation,
					userOwnsRepresentation: true
				});
			} else {
				acc.push({
					...currentRepresentation,
					userOwnsRepresentation: false
				});
			}
			return acc;
		}, []);
	}

	// rule 6 and appellant ownership

	// filter out interested party comments as ownership always false
	const { ipComments, otherRepresentations } = representations.reduce(
		(acc, currentRepresentation) => {
			if (
				currentRepresentation.representationType == REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
			) {
				acc.ipComments.push({
					...currentRepresentation,
					userOwnsRepresentation: false
				});
			} else {
				acc.otherRepresentations.push(currentRepresentation);
			}
			return acc;
		},
		{ ipComments: [], otherRepresentations: [] }
	);

	// otherRepresentations won't include interested party comments

	//create a set of serviceUserIds ie unique values
	const serviceUserIds = new Set(
		otherRepresentations.map((rep) => rep.serviceUserId).filter(Boolean)
	);

	// call to service user repo, return serviceUserId and email if id is serviceUserIds array.
	const serviceUsersWithEmails = getServiceUsersWithEmailsByIdAndCaseReference(
		[...serviceUserIds],
		caseReference
	);

	const emailMatchedIds = serviceUsersWithEmails
		.filter((serviceUser) => serviceUser.emailAddress == email)
		.map((serviceUser) => serviceUser.id);

	// add userOwnsRepresentation field to otherRepresentations
	const detailedRepresentations = otherRepresentations.reduce((acc, currentRepresentation) => {
		if (emailMatchedIds.includes(currentRepresentation.serviceUserId)) {
			acc.push({
				...currentRepresentation,
				userOwnsRepresentation: true
			});
		} else {
			acc.push({
				...currentRepresentation,
				userOwnsRepresentation: false
			});
		}
		return acc;
	}, []);

	// return array of original representations with userOwnsRepresentation fields
	return [...ipComments, ...detailedRepresentations];
}

module.exports = {
	getAppealCaseWithAllRepresentations,
	getAppealCaseWithRepresentationsByType,
	addOwnershipDetailsToRepresentations
};
