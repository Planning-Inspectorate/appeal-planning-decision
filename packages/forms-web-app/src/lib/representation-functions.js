const {
	LPA_USER_ROLE,
	APPEAL_USER_ROLES,
	REPRESENTATION_TYPES
} = require('@pins/common/src/constants');
const escape = require('escape-html');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import('appeals-service-api').Api.Representation} Representation
 * @typedef {import('appeals-service-api').Api.RepresentationDocument} RepresentationDocument
 * @typedef {import('appeals-service-api').Api.Document} Document
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 * @typedef {import('@pins/common/src/constants').RepresentationTypes} RepresentationTypes
 * @typedef {import('../controllers/selected-appeal/representations/index').RepresentationParams} RepresentationParams
 */

/**
 * @param {AppealCaseDetailed} caseData
 * @param {RepresentationParams} representationParams
 * @returns {Representation[]}
 */
const filterRepresentationsForDisplay = (caseData, representationParams) => {
	const { userType, submittingParty, rule6OwnRepresentations } = representationParams;

	if (!caseData.Representations || caseData.Representations.length === 0) return [];

	const representations = caseData.Representations;

	const representationsFilteredBySubmittingParty = filterRepresentationsBySubmittingParty(
		representations,
		submittingParty
	);

	if (
		userType == APPEAL_USER_ROLES.RULE_6_PARTY &&
		submittingParty == APPEAL_USER_ROLES.RULE_6_PARTY
	) {
		return filterRepresentationsForRule6ViewingRule6(
			representationsFilteredBySubmittingParty,
			!!rule6OwnRepresentations
		).filter(
			(representation) =>
				representation.userOwnsRepresentation || representation.representationStatus == 'published'
		);
	} else {
		return representationsFilteredBySubmittingParty.filter(
			(representation) =>
				representation.userOwnsRepresentation || representation.representationStatus == 'published'
		);
	}
};

/**
 * @param {Representation[]} representations
 * @param {AppealToUserRoles|LpaUserRole} submittingParty
 * @returns {Representation[]}
 */
// Filters the Representation Array based on the desired submitting party
// Assumes the following logic:
// - representations submitted by lpaUsers will not have a serviceUserId
// - the users array on the AppealCase contains serviceUser information for Agents and Appellants only
// - representations with non-null serviceUserId values will have been submitted by Agent/Appellant, Rule6Party of InterestedParty
// - in theory the return for Rule6Parties could include interested parties - however interestedParties only submit comments and these should not be filtered by this function
const filterRepresentationsBySubmittingParty = (representations, submittingParty) => {
	switch (submittingParty) {
		case APPEAL_USER_ROLES.AGENT:
		case APPEAL_USER_ROLES.APPELLANT:
			return representations.filter(
				(representation) =>
					representation.submittingPartyType === APPEAL_USER_ROLES.AGENT ||
					representation.submittingPartyType === APPEAL_USER_ROLES.APPELLANT
			);
		default:
			return representations.filter(
				(representation) => representation.submittingPartyType === submittingParty
			);
	}
};

/**
 * @param {Representation[]} representations
 * @param {boolean} rule6OwnRepresentations
 * @returns {Representation[]}
 */
const filterRepresentationsForRule6ViewingRule6 = (representations, rule6OwnRepresentations) => {
	return rule6OwnRepresentations
		? representations.filter((representation) => representation.userOwnsRepresentation)
		: representations.filter((representation) => !representation.userOwnsRepresentation);
};

/**
 * @param {RepresentationParams} representationParams
 * @returns {string}
 */
const formatRepresentationHeading = (representationParams) => {
	const { userType, submittingParty, representationType, rule6OwnRepresentations } =
		representationParams;

	switch (representationType) {
		case REPRESENTATION_TYPES.STATEMENT:
			return formatStatementHeading(userType, submittingParty, !!rule6OwnRepresentations);
		case REPRESENTATION_TYPES.FINAL_COMMENT:
			return formatFinalCommentsHeading(userType, submittingParty);
		case REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE:
			return formatProofsOfEvidenceHeading(userType, submittingParty, !!rule6OwnRepresentations);
		case REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT:
			return 'Interested Party Comments';
		default:
			return '';
	}
};

/**
 * @param {AppealToUserRoles|LpaUserRole} userType
 * @param {AppealToUserRoles|LpaUserRole} submittingParty
 * @param {Boolean} rule6OwnRepresentations
 * @returns {string}
 */
const formatStatementHeading = (userType, submittingParty, rule6OwnRepresentations) => {
	switch (userType) {
		case LPA_USER_ROLE:
			return submittingParty == LPA_USER_ROLE ? 'Your statement' : 'Statements from other parties';
		case APPEAL_USER_ROLES.AGENT:
		case APPEAL_USER_ROLES.APPELLANT:
		case APPEAL_USER_ROLES.RULE_6_PARTY:
			if (rule6OwnRepresentations) {
				return 'Your statement';
			} else {
				return submittingParty == LPA_USER_ROLE
					? 'Local planning authority statement'
					: 'Statements from other parties';
			}
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
 * @param {Boolean} rule6OwnRepresentations
 * @returns {string}
 */
const formatProofsOfEvidenceHeading = (userType, submittingParty, rule6OwnRepresentations) => {
	switch (submittingParty) {
		case LPA_USER_ROLE:
			return userType == LPA_USER_ROLE
				? 'Your proof of evidence and witnesses'
				: 'Local planning authority proof of evidence and witnesses';
		case APPEAL_USER_ROLES.AGENT:
		case APPEAL_USER_ROLES.APPELLANT:
			return userType == APPEAL_USER_ROLES.APPELLANT || userType == APPEAL_USER_ROLES.AGENT
				? 'Your proof of evidence and witnesses'
				: 'Appellant’s proof of evidence and witnesses';
		case APPEAL_USER_ROLES.RULE_6_PARTY:
			return rule6OwnRepresentations
				? 'Your proof of evidence and witnesses'
				: 'Proof of evidence and witnesses from other parties';
		default:
			return 'Proof of evidence and witnesses';
	}
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {Representation[]} representations
 */
const formatRepresentations = (caseData, representations) => {
	representations.sort((a, b) => new Date(a.dateReceived) - new Date(b.dateReceived));

	return representations.map((representation, index) => {
		const fullText = representation.redacted
			? representation.redactedRepresentation
			: representation.originalRepresentation;
		const truncated = fullText ? fullText.length > 150 : false;
		const truncatedText = truncated ? fullText.substring(0, 150) + '...' : fullText;

		const rowLabel = formatRowLabelAndKey(representation.representationType);

		/** @type {string[]} */
		const repDocsIds = representation.RepresentationDocuments
			? representation.RepresentationDocuments?.map((x) => x.documentId)
			: [];

		const representationDocuments = caseData?.Documents
			? caseData?.Documents?.filter((doc) => repDocsIds.includes(doc.id))
			: [];

		const formattedDocuments =
			representation.representationType === REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
				? formatProofsOfEvidenceDocuments(representationDocuments)
				: formatRepresentationDocumentsLinks(representationDocuments, 'Supporting documents');

		return {
			key: { text: `${rowLabel} ${index + 1}` },
			rowLabel,
			value: {
				text: fullText,
				truncatedText: truncatedText,
				truncated: truncated,
				documents: formattedDocuments
			}
		};
	});
};

/**
 * @param {Document[]} documentDetails
 * @param {string} documentsLabel
 */
const formatRepresentationDocumentsLinks = (documentDetails, documentsLabel) => {
	const documentsLinks =
		documentDetails.length > 0
			? documentDetails.map(formatDocumentLink).join('\n')
			: 'No documents';

	return [
		{
			documentsLabel,
			documentsLinks
		}
	];
};

/**
 * @param {Document[]} documentDetails
 */
const formatProofsOfEvidenceDocuments = (documentDetails) => {
	const { proofs, witnesses } = documentDetails.reduce(
		(acc, document) => {
			if (isProofsDocument(document)) {
				acc.proofs.push(document);
			} else {
				acc.witnesses.push(document);
			}
			return acc;
		},
		{ proofs: [], witnesses: [] }
	);

	const proofsLinks =
		proofs.length > 0 ? proofs.map(formatDocumentLink).join('\n') : 'No documents';
	const witnessesLinks =
		witnesses.length > 0 ? witnesses.map(formatDocumentLink).join('\n') : 'No documents';

	return [
		{
			documentsLabel: 'Proof of evidence and summary',
			documentsLinks: proofsLinks
		},
		{
			documentsLabel: 'Witnesses and their evidence',
			documentsLinks: witnessesLinks
		}
	];
};

/**
 * @param {import('appeals-service-api').Api.Document} document
 * @returns {string}
 */
const formatDocumentLink = (document) => {
	if (document.redacted) {
		return `<a href="/published-document/${document.id}" class="govuk-link">${escape(
			document.filename
		)}</a>`;
	}

	return escape(document.filename) + ' - awaiting review';
};

/**
 * @param {RepresentationTypes} representationType
 * @returns {string}
 */
const formatRowLabelAndKey = (representationType) => {
	switch (representationType) {
		case REPRESENTATION_TYPES.STATEMENT:
			return 'Statement';
		case REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT:
			return 'Interested party';
		case REPRESENTATION_TYPES.FINAL_COMMENT:
			return 'Final comments';
		default:
			return 'Representation';
	}
};

/**
 * @param {Document} document
 * @returns {boolean}
 */
const isProofsDocument = (document) => {
	const { documentType } = document;

	return (
		documentType === 'lpaProofs' ||
		documentType === 'appellantProofs' ||
		documentType === 'rule6Proofs'
	);
};

module.exports = {
	filterRepresentationsForDisplay,
	formatRepresentationHeading,
	formatRepresentations
};
