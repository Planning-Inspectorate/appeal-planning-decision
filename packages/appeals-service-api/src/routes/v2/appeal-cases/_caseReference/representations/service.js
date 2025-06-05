const { RepresentationsRepository } = require('./repo');
const { appendAppellantAndAgent } = require('../../service');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');
const ApiError = require('#errors/apiError');
const { REPRESENTATION_TYPES } = require('@pins/common/src/constants');
const { getServiceUsersWithEmailsByIdAndCaseReference } = require('../../../service-users/service');
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
 *
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 * @typedef { 'LPAUser' } LpaUserRole
 *
 * @typedef {import ('pins-data-model').Schemas.AppealRepresentation} AppealRepresentation
 */

/**
 *
 * @param {string} caseReference
 * @returns {Promise<import('./repo').AppealWithRepresentations>}
 */
async function getAppealCaseWithAllRepresentations(caseReference) {
	const appealCaseWithRepresentations =
		await repo.getAppealCaseWithAllRepresentations(caseReference);
	if (!appealCaseWithRepresentations) throw ApiError.appealsCaseDataNotFound();

	const appealCaseWithApplicant = await appendAppellantAndAgent(appealCaseWithRepresentations);

	return appealCaseWithApplicant;
}

/**
 *
 * @param {string} caseReference
 * @param {string} type
 * @returns {Promise<import('./repo').AppealWithRepresentations>}
 */
async function getAppealCaseWithRepresentationsByType(caseReference, type) {
	const appealCaseWithRepresentations = await repo.getAppealCaseWithRepresentationsByType(
		caseReference,
		type
	);

	if (!appealCaseWithRepresentations) throw ApiError.appealsCaseDataNotFound();

	const appealCaseWithApplicant = await appendAppellantAndAgent(appealCaseWithRepresentations);

	return appealCaseWithApplicant;
}

/**
 * @param {string} caseReference
 * @param {Representation[]} representations
 */
async function getServiceUsersWithEmails(caseReference, representations) {
	// get unique list of service user ids for any non-ip comment representations
	// ip comments are ignored as they have no associated login and so ownership always false
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
	return await getServiceUsersWithEmailsByIdAndCaseReference([...serviceUserIds], caseReference);
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
	getServiceUsersWithEmails,
	putRepresentation
};
