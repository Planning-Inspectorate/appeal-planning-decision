const {
	representationPublished,
	representationExists
} = require('@pins/common/src/lib/representations');
const {
	LPA_USER_ROLE,
	APPEAL_USER_ROLES,
	REPRESENTATION_TYPES
} = require('@pins/common/src/constants');

/**
 * @type {import("@pins/common/src/view-model-maps/sections/def").Sections}
 */
exports.sections = [
	{
		heading: 'Appeal details',
		links: [
			{
				url: '/appeal-details',
				text: 'View your appeal details',
				condition: () => true
			}
		]
	},
	{
		heading: 'Questionnaire',
		links: [
			{
				url: '/questionnaire',
				text: 'View questionnaire',
				condition: (appealCase) => appealCase.lpaQuestionnairePublishedDate !== null
			}
		]
	},
	{
		heading: 'Statements',
		links: [
			{
				url: '/lpa-statement',
				text: 'View local planning authority statement',
				condition: (appealCase) =>
					representationPublished(appealCase.Representations, {
						type: REPRESENTATION_TYPES.STATEMENT,
						owned: false,
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
				condition: (appealCase) =>
					representationExists(appealCase.Representations, {
						type: REPRESENTATION_TYPES.FINAL_COMMENT,
						owned: true,
						submitter: APPEAL_USER_ROLES.APPELLANT
					})
			},
			{
				url: '/lpa-final-comments',
				text: 'View local planning authority final comments',
				condition: (appealCase) =>
					representationPublished(appealCase.Representations, {
						type: REPRESENTATION_TYPES.FINAL_COMMENT,
						owned: false,
						submitter: LPA_USER_ROLE
					})
			}
		]
	},
	{
		heading: 'Planning obligation',
		links: [
			{
				url: '/planning-obligation',
				text: 'View planning obligation',
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
				condition: (appealCase) =>
					representationExists(appealCase.Representations, {
						type: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
						owned: true,
						submitter: APPEAL_USER_ROLES.APPELLANT
					})
			},
			{
				url: '/lpa-proof-evidence',
				text: 'View the local planning authority proof of evidence and witnesses',
				condition: (appealCase) =>
					representationPublished(appealCase.Representations, {
						type: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
						owned: false,
						submitter: LPA_USER_ROLE
					})
			},
			{
				url: '/other-party-proof-evidence',
				text: 'View other party proof of evidence and witnesses',
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
