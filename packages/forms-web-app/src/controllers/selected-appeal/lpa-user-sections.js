const {
	representationPublished,
	representationExists,
	getRepresentationSubmissionDate
} = require('@pins/common/src/lib/representations');
const {
	LPA_USER_ROLE,
	APPEAL_USER_ROLES,
	REPRESENTATION_TYPES,
	SUBMISSIONS
} = require('@pins/common/src/constants');
const { formatSubmissionDate } = require('@pins/common/src/lib/format-appeal-details');

/**
 * @type {import("@pins/common/src/view-model-maps/sections/def").Sections}
 */

exports.sections = [
	{
		heading: 'Appeal details',
		links: [
			{
				url: '/appeal-details',
				text: 'View appeal details',
				condition: (appealCase) => !!appealCase.caseValidDate
			}
		]
	},
	{
		heading: 'Questionnaire',
		links: [
			{
				url: '/questionnaire',
				text: 'View questionnaire',
				submissionDate: {
					text: (appealCase) =>
						formatSubmissionDate(
							SUBMISSIONS.QUESTIONNAIRE,
							appealCase.lpaQuestionnaireSubmittedDate
						)
				},
				condition: (appealCase) => !!appealCase.lpaQuestionnaireSubmittedDate
			}
		]
	},
	{
		heading: 'Statements',
		links: [
			{
				url: '/statement',
				text: 'View your statement',
				submissionDate: {
					text: (appealCase) =>
						formatSubmissionDate(
							SUBMISSIONS.STATEMENT,
							getRepresentationSubmissionDate(appealCase.Representations, {
								type: REPRESENTATION_TYPES.STATEMENT,
								owned: true,
								submitter: LPA_USER_ROLE
							})
						)
				},
				condition: (appealCase) =>
					representationExists(appealCase.Representations, {
						type: REPRESENTATION_TYPES.STATEMENT,
						owned: true,
						submitter: LPA_USER_ROLE
					})
			},
			{
				url: '/other-party-statements',
				text: 'View other party statements',
				condition: (appealCase) =>
					representationPublished(appealCase.Representations, {
						type: REPRESENTATION_TYPES.STATEMENT,
						owned: false,
						submitter: APPEAL_USER_ROLES.RULE_6_PARTY
					})
			}
		]
	},
	{
		heading: 'Interested party comments',
		links: [
			{
				url: '/interested-party-comments',
				text: 'View interested party comments',
				condition: (appealCase) =>
					representationPublished(appealCase.Representations, {
						type: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
					})
			}
		]
	},
	{
		heading: 'Final comments',
		links: [
			{
				url: '/final-comments',
				text: 'View your final comments',
				submissionDate: {
					text: (appealCase) =>
						formatSubmissionDate(
							SUBMISSIONS.FINAL_COMMENT,
							getRepresentationSubmissionDate(appealCase.Representations, {
								type: REPRESENTATION_TYPES.FINAL_COMMENT,
								owned: true,
								submitter: LPA_USER_ROLE
							})
						)
				},
				condition: (appealCase) =>
					representationExists(appealCase.Representations, {
						type: REPRESENTATION_TYPES.FINAL_COMMENT,
						owned: true,
						submitter: LPA_USER_ROLE
					})
			},
			{
				url: '/appellant-final-comments',
				text: 'View appellant final comments',
				condition: (appealCase) =>
					representationPublished(appealCase.Representations, {
						type: REPRESENTATION_TYPES.FINAL_COMMENT,
						owned: false,
						submitter: APPEAL_USER_ROLES.APPELLANT
					})
			}
		]
	},
	{
		heading: 'Planning obligation',
		links: [
			{
				url: '/appellant-planning-obligation',
				text: 'View the appellant’s planning obligation',
				condition: (appealCase) => !!appealCase.statusPlanningObligation
			}
		]
	},
	{
		heading: 'Proof of evidence and witnesses',
		links: [
			{
				url: '/proof-evidence',
				text: 'View your proof of evidence and witnesses',
				submissionDate: {
					text: (appealCase) =>
						formatSubmissionDate(
							SUBMISSIONS.PROOFS_EVIDENCE,
							getRepresentationSubmissionDate(appealCase.Representations, {
								type: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
								owned: true,
								submitter: LPA_USER_ROLE
							})
						)
				},
				condition: (appealCase) =>
					representationExists(appealCase.Representations, {
						type: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
						owned: true,
						submitter: LPA_USER_ROLE
					})
			},
			{
				url: '/appellant-proof-evidence',
				text: "View the appellant's proof of evidence and witnesses",
				condition: (appealCase) =>
					representationPublished(appealCase.Representations, {
						type: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
						owned: false,
						submitter: APPEAL_USER_ROLES.APPELLANT
					})
			},
			{
				url: '/other-party-proof-evidence',
				text: 'View proof of evidence and witnesses from other parties',
				condition: (appealCase) =>
					representationPublished(appealCase.Representations, {
						type: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
						owned: false,
						submitter: APPEAL_USER_ROLES.RULE_6_PARTY
					})
			}
		]
	}
];
