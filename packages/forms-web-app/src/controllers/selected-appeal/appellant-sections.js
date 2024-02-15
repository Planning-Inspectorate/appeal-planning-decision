/**
 * @type {import('./section').Section}
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
				condition: (appealCase) => appealCase.lpaStatementPublished
			},
			{
				// tbc
				url: '/rule-6-statements',
				text: 'View other party statements',
				condition: (appealCase) => appealCase.appealRule6PartyStatementsPublished
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
				condition: (appealCase) => appealCase.interestedPartyCommentsPublished
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
				condition: (appealCase) => appealCase.appellantFinalCommentReceived
			},
			{
				// tbc
				url: '/lpa-final-comments',
				text: 'View local planning authority final comments',
				condition: (appealCase) => appealCase.lpaFinalCommentPublished
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
				condition: (appealCase) => appealCase.appellantProofEvidenceReceived
			},
			{
				// tbc
				url: '/lpa-proof-of-evidences',
				text: 'View the local planning authority proof of evidence and witnesses',
				condition: (appealCase) => appealCase.lpaProofEvidencePublished
			},
			{
				// tbc
				url: '/rule-6-proof-of-evidences',
				text: 'View other party proof of evidence and witnesses',
				condition: (appealCase) => appealCase.appealRule6PartyProofsEvidencePublished
			}
		]
	}
];
