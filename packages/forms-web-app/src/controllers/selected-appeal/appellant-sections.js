/**
 * @type {import("@pins/common/src/view-model-maps/sections/def").Sections}
 */
exports.sections = [
	{
		heading: 'Appeal details',
		links: [
			{
				// tbc
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
				// tbc
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
				// tbc
				url: '/lpa-statement',
				text: 'View local planning authority statement',
				condition: (appealCase) => !!appealCase.lpaStatementPublished // lpaStatementPublished on ticket?
			},
			{
				// tbc
				url: '/other-party-statements',
				text: 'View other party statements',
				condition: (appealCase) => !!appealCase.rule6StatementPublished // changed from appealRule6PartyStatementsPublished
			}
		]
	},
	{
		heading: 'Interested party comments',
		links: [
			{
				// tbc
				url: '/interested-party-comments',
				text: 'View interested party comments',
				condition: (appealCase) => !!appealCase.interestedPartyCommentsPublished // schema matched ticket
			}
		]
	},
	{
		heading: 'Final comments',
		links: [
			{
				// tbc
				url: '/final-comments',
				text: 'View your final comments',
				condition: (appealCase) => !!appealCase.appellantFinalCommentsSubmitted // appellantCommentsReceived on ticket?
			},
			{
				// tbc
				url: '/lpa-final-comments',
				text: 'View local planning authority final comments',
				condition: (appealCase) => !!appealCase.lpaFinalCommentsPublished // changed from lpaFinalCommentPublished
			}
		]
	},
	{
		heading: 'Planning obligation',
		links: [
			{
				url: '/planning-obligation',
				text: 'View planning obligation',
				condition: (appealCase) => !!appealCase.planningObligation
			}
		]
	},
	{
		heading: 'Proof of evidence and witnesses',
		links: [
			{
				// tbc
				url: '/proof-evidence',
				text: 'View your proof of evidence and witnesses',
				condition: (appealCase) => !!appealCase.appellantProofEvidencePublished // appellantsProofEvidenceReceived on ticket?
			},
			{
				// tbc
				url: '/lpa-proof-evidence',
				text: 'View the local planning authority proof of evidence and witnesses',
				condition: (appealCase) => !!appealCase.lpaProofEvidencePublished // schema matched ticket
			},
			{
				// tbc
				url: '/other-party-proof-evidence',
				text: 'View other party proof of evidence and witnesses',
				condition: (appealCase) => !!appealCase.rule6ProofsEvidencePublished // appealRule6PartyProofsEvidencePublished on ticket?
			}
		]
	}
];
