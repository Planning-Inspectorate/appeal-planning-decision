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
			return caseData.Representations.filter((representation) => !representation.serviceUserId);
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
 * @param {AppealCaseDetailed} caseData
 * @param {string} serviceUserId
 * @param {boolean} rule6OwnRepresentations
 * @returns {Representation[]}
 */
const filterRepresentationsForRule6ViewingRule6 = (
	caseData,
	serviceUserId,
	rule6OwnRepresentations
) => {
	if (!serviceUserId) return [];

	const unfilteredRepresentations = filterRepresentationsBySubmittingParty(
		caseData,
		APPEAL_USER_ROLES.RULE_6_PARTY
	);

	return rule6OwnRepresentations
		? unfilteredRepresentations.filter(
				(representation) => representation.serviceUserId == serviceUserId
		  )
		: unfilteredRepresentations.filter(
				(representation) => representation.serviceUserId != serviceUserId
		  );
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
 * @param {Representation[]} representations
 */
const formatRepresentations = (representations) => {
	representations.sort((a, b) => new Date(a.dateReceived) - new Date(b.dateReceived));

	const formattedRepresentations = representations.map((representation, index) => {
		const fullText = representation.redacted
			? representation.redactedRepresentation
			: representation.originalRepresentation;
		const truncated = fullText ? fullText.length > 150 : false;
		const truncatedText = truncated ? fullText.substring(0, 150) + '...' : fullText;

		const rowLabel = formatRowLabelAndKey(representation.representationType);

		const documents =
			representation.representationType === REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE
				? formatProofsOfEvidenceDocuments(representation.RepresentationDocuments)
				: formatRepresentationDocumentsLinks(
						representation.RepresentationDocuments,
						'Supporting documents'
				  );

		return {
			key: { text: `${rowLabel} ${index + 1}` },
			rowLabel,
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

/**
 * @param {RepresentationDocument[]} representationDocuments
 * @param {string} documentsLabel
 */
const formatRepresentationDocumentsLinks = (representationDocuments, documentsLabel) => {
	const documents = representationDocuments.map(
		(representationDocument) => representationDocument.Document
	);

	const documentsLinks =
		documents.length > 0 ? documents.map(formatDocumentLink).join('\n') : 'No documents';

	return [
		{
			documentsLabel,
			documentsLinks
		}
	];
};

/**
 * @param {RepresentationDocument[]} representationDocuments
 */
const formatProofsOfEvidenceDocuments = (representationDocuments) => {
	const documents = representationDocuments.map(
		(representationDocument) => representationDocument.Document
	);

	const { proofs, witnesses } = documents.reduce(
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
	filterRepresentationsBySubmittingParty,
	filterRepresentationsForRule6ViewingRule6,
	formatRepresentationHeading,
	formatRepresentations
};
