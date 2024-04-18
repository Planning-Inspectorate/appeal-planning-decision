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
				condition: (appealCase) => appealCase.caseReceived
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
				condition: (appealCase) => appealCase.lpaQuestionnairePublished
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
				condition: (appealCase) => appealCase.lpaStatementPublished // lpaStatementPublished on ticket?
			},
			{
				// tbc
				url: '/rule-6-statements',
				text: 'View other party statements',
				condition: (appealCase) => appealCase.rule6StatementPublished // changed from appealRule6PartyStatementsPublished
			}
		]
	},
	{
		heading: 'Interested party comments',
		links: [
			{
				// tbc
				url: '/ip-comments',
				text: 'View interested party comments',
				condition: (appealCase) => appealCase.interestedPartyCommentsPublished // schema matched ticket
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
				condition: (appealCase) => appealCase.appellantFinalCommentsSubmitted // appellantCommentsReceived on ticket?
			},
			{
				// tbc
				url: '/lpa-final-comments',
				text: 'View local planning authority final comments',
				condition: (appealCase) => appealCase.lpaFinalCommentsPublished // changed from lpaFinalCommentPublished
			}
		]
	},
	{
		heading: 'Proof of evidence and witnesses',
		links: [
			{
				// tbc
				url: '/proof-of-evidences',
				text: 'View your proof of evidence and witnesses',
				condition: (appealCase) => appealCase.appellantProofEvidencePublished // appellantsProofEvidenceReceived on ticket?
			},
			{
				// tbc
				url: '/lpa-proof-of-evidences',
				text: 'View the local planning authority proof of evidence and witnesses',
				condition: (appealCase) => appealCase.lpaProofEvidencePublished // schema matched ticket
			},
			{
				// tbc
				url: '/rule-6-proof-of-evidences',
				text: 'View other party proof of evidence and witnesses',
				condition: (appealCase) => appealCase.rule6ProofsEvidencePublished // appealRule6PartyProofsEvidencePublished on ticket?
			}
		]
	}
];
