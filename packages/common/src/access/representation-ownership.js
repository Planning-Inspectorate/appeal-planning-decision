const { REPRESENTATION_TYPES, LPA_USER_ROLE, APPEAL_USER_ROLES } = require('../constants');
const {
	APPEAL_SOURCE,
	APPEAL_REPRESENTATION_STATUS
} = require('@planning-inspectorate/data-model');

/**
 * @typedef {import('@pins/database/src/client/client').Representation} Representation
 * @typedef {Pick<Representation, 'source' | 'serviceUserId' | 'representationType'>} RepresentationInput
 * @typedef {RepresentationInput & { userOwnsRepresentation: boolean, submittingPartyType?: string } } RepresentationResult
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 * @typedef { 'LPAUser' } LpaUserRole
 * @typedef {import('@pins/database/src/client/client').ServiceUser} ServiceUser
 * @typedef {Pick<ServiceUser, 'id' | 'emailAddress' | 'serviceUserType'>} BasicServiceUser
 * @typedef { {
 *   representationStatus: string|null,
 *   documentId: string,
 *   userOwnsRepresentation: boolean,
 *   submittingPartyType: string | undefined
 * } } FlatRepDocOwnership
 */

/**
 * This logic is repeated in documents api
 * @param {RepresentationInput[]} representations
 * @param {string} email
 * @param {boolean} isLpa
 * @param {BasicServiceUser[]} serviceUsersWithEmails
 * @returns {RepresentationResult[]}
 */
exports.addOwnershipAndSubmissionDetailsToRepresentations = (
	representations,
	email,
	isLpa,
	serviceUsersWithEmails
) => {
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
			(rep.source === APPEAL_SOURCE.LPA && isLpa) ||
			(rep.source !== APPEAL_SOURCE.LPA &&
				!!rep.serviceUserId &&
				loggedInUserIds.has(rep.serviceUserId)),
		submittingPartyType: ascertainSubmittingParty(rep, serviceUsersWithEmails)
	}));
};

/**
 *
 * @param {RepresentationInput} representation
 * @param {BasicServiceUser[]|[]} serviceUsersWithEmails
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
 * Determines if a document is available for the user based on representation ownership and status.
 * @param {import('@pins/database/src/client/client').Document} document
 * @param {Map<string, FlatRepDocOwnership>} representationMap
 * @returns {boolean}
 */
exports.checkDocumentAccessByRepresentationOwner = (document, representationMap) => {
	// see if the document belongs to a representation
	const rep = representationMap.get(document.id);

	// doc does not belong to a representation so we can skip representation checks
	if (!rep) {
		return true;
	}

	// return true if the user either owns the representation or it is published
	return (
		rep.userOwnsRepresentation ||
		rep.representationStatus === APPEAL_REPRESENTATION_STATUS.PUBLISHED
	);
};
