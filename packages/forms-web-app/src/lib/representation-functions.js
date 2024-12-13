const {
	LPA_USER_ROLE,
	APPEAL_USER_ROLES,
	REPRESENTATION_TYPES
} = require('@pins/common/src/constants');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import('appeals-service-api').Api.Representation} Representation
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 * @typedef {import('@pins/common/src/constants').RepresentationTypes} RepresentationTypes
 */

/**
 * @param {AppealCaseDetailed} caseData
 * @param {AppealToUserRoles|LpaUserRole} submittingParty
 * @returns {Representation[]}
 */
// Filters the Representation Array based on the desired submitting party
// Assumes the following logic:
// - representations submitted by lpaUsers will not have a serviceUserId
// - the users array on the AppealCase contains serviceUser information for Agents and Appellants only
// - representations with non-null serviceUserId values will have been submitted by Agent/Appellant, Rule6Party of InterestedParty
// - in theory the return for Rule6Parties could include interested parties - however interestedParties only submit comments and these should not be filtered by this function
const filterRepresentationsBySubmittingParty = (caseData, submittingParty) => {
	if (!caseData.Representations || caseData.Representations.length === 0) return [];
	const applicantPartyServiceUserIds = caseData.users?.map((user) => user.id);

	switch (submittingParty) {
		case LPA_USER_ROLE:
			return caseData.Representations.filter(
				(representation) => representation.serviceUserId === null
			);
		case APPEAL_USER_ROLES.AGENT:
		case APPEAL_USER_ROLES.APPELLANT:
			return caseData.Representations.filter(
				(representation) =>
					representation.serviceUserId &&
					applicantPartyServiceUserIds?.includes(representation.serviceUserId)
			);
		case APPEAL_USER_ROLES.RULE_6_PARTY:
			return caseData.Representations.filter(
				(representation) =>
					representation.serviceUserId &&
					!applicantPartyServiceUserIds?.includes(representation.serviceUserId)
			);
		default:
			return [];
	}
};

/**
 * @param {RepresentationTypes} representationType
 * @param {AppealToUserRoles|LpaUserRole} userType
 * @param {AppealToUserRoles|LpaUserRole} submittingParty
 * @returns {string}
 */
const formatRepresentationHeading = (representationType, userType, submittingParty) => {
	switch (representationType) {
		case REPRESENTATION_TYPES.STATEMENT:
			return formatStatementHeading(userType, submittingParty);
		case REPRESENTATION_TYPES.FINAL_COMMENT:
			return formatFinalCommentsHeading(userType, submittingParty);
		case REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE:
			return formatProofsOfEvidenceHeading(userType, submittingParty);
		case REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT:
			return 'Interested Party Comments';
		default:
			return '';
	}
};

/**
 * @param {AppealToUserRoles|LpaUserRole} userType
 * @param {AppealToUserRoles|LpaUserRole} submittingParty
 * @returns {string}
 */
const formatStatementHeading = (userType, submittingParty) => {
	switch (userType) {
		case LPA_USER_ROLE:
			return submittingParty == LPA_USER_ROLE ? 'Your statement' : 'Statements from other parties';
		case APPEAL_USER_ROLES.AGENT:
		case APPEAL_USER_ROLES.APPELLANT:
		case APPEAL_USER_ROLES.RULE_6_PARTY:
			return submittingParty == LPA_USER_ROLE
				? 'Local planning authority statement'
				: 'Statements from other parties';
		default:
			return 'Appeal statement';
	}
};

/**
 * @param {AppealToUserRoles|LpaUserRole} userType
 * @param {AppealToUserRoles|LpaUserRole} submittingParty
 * @returns {string}
 */
const formatFinalCommentsHeading = (userType, submittingParty) => {
	switch (userType) {
		case LPA_USER_ROLE:
			return submittingParty == LPA_USER_ROLE
				? 'Your final comments'
				: "Appellant's final comments";
		case APPEAL_USER_ROLES.AGENT:
		case APPEAL_USER_ROLES.APPELLANT:
			return submittingParty == LPA_USER_ROLE
				? 'Local planning authority final comments'
				: 'Your final comments';
		case APPEAL_USER_ROLES.RULE_6_PARTY:
			return submittingParty == LPA_USER_ROLE
				? 'Local planning authority final comments'
				: "Appellant's final comments";
		default:
			return 'Final comments';
	}
};

/**
 * @param {AppealToUserRoles|LpaUserRole} userType
 * @param {AppealToUserRoles|LpaUserRole} submittingParty
 * @returns {string}
 */
const formatProofsOfEvidenceHeading = (userType, submittingParty) => {
	// LPA_USER_ROLE
	// 	LPA_USER_ROLE - 'Your proof of evidence and witnesses'
	// 	"Appellant’s proof of evidence and witnesses"
	// 	'Local planning authority proof of evidence and witnesses'
	// 	'Proof of evidence and witnesses from other parties'
	// switch (userType) {
	// 	case LPA_USER_ROLE:
	// 		return submittingParty == LPA_USER_ROLE ? 'Your statement' : 'Statements from other parties';
	// 	case APPEAL_USER_ROLES.AGENT:
	// 	case APPEAL_USER_ROLES.APPELLANT:
	// 	case APPEAL_USER_ROLES.RULE_6_PARTY:
	// 		return submittingParty == LPA_USER_ROLE ? 'Local planning authority statement' : 'Statements from other parties';
	// 	default:
	return `Appeal statement ${userType} ${submittingParty}`;
	// }
};

/**
 * @param {Representation[]} representations
 */
const formatRepresentations = (representations) => {
	representations.sort((a, b) => new Date(a.dateReceived) - new Date(b.dateReceived));

	const formattedRepresentations = representations.map((representation, index) => {
		const fullText = representation.redacted
			? representation.redactedRepresentation
			: representation.originalRepresentation;
		const truncated = fullText.length > 150;
		const truncatedText = truncated ? fullText.substring(0, 150) + '...' : fullText;

		const documents = representation.RepresentationDocuments?.map(
			(representationDocument) => representationDocument.documentId
		);
		return {
			key: { text: `Test it now ${index + 1}` },
			value: {
				text: fullText,
				truncatedText: truncatedText,
				truncated: truncated,
				documents
			}
		};
	});

	return formattedRepresentations;
};

module.exports = {
	filterRepresentationsBySubmittingParty,
	formatRepresentationHeading,
	formatRepresentations
};
