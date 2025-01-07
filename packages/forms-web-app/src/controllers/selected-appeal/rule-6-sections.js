/**
 * @type {import("@pins/common/src/view-model-maps/sections/def").Sections}
 */

// todo: update all selected appeal sections

exports.sections = [
	{
		heading: 'Appeal details',
		links: [
			{
				url: '/appeal-details',
				text: 'View appeal details',
				condition: (appealCase) => !!appealCase.casePublishedDate
			}
		]
	},
	{
		heading: 'Questionnaire',
		links: [
			{
				url: '/questionnaire',
				text: 'View questionnaire',
				condition: (appealCase) => !!appealCase.lpaQuestionnairePublishedDate
			}
		]
	},
	{
		heading: 'Statements',
		links: [
			{
				url: '/statement',
				text: 'View your statement',
				condition: (appealCase) => appealCase.rule6StatementPublished
			},
			{
				url: '/lpa-statement',
				text: 'View local planning authority statement',
				condition: (appealCase) => appealCase.lpaStatementPublished
			},
			{
				url: '/other-party-statements',
				text: 'View other party statements',
				condition: (appealCase) => appealCase.rule6StatementPublished
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
				condition: (appealCase) => appealCase.interestedPartyCommentsPublished // schema matched ticket
			}
		]
	},
	{
		heading: 'Final comments',
		links: [
			{
				// tbc
				url: '/appellant-final-comments',
				text: "View appellant's final comments",
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
				text: 'View the appellant’s planning obligation',
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
				condition: (appealCase) => appealCase.rule6ProofsEvidencePublished
			},
			{
				// tbc
				url: '/appellant-proof-evidence',
				text: `View appellant's proof of evidence and witnesses`,
				condition: (appealCase) => appealCase.appellantProofEvidencePublished
			},
			{
				// tbc
				url: '/lpa-proof-evidence',
				text: 'View the local planning authority proof of evidence and witnesses',
				condition: (appealCase) => appealCase.lpaProofEvidencePublished
			},
			{
				// tbc
				url: '/other-party-proof-evidence',
				text: 'View proof of evidence and witnesses from other parties',
				condition: (appealCase) => appealCase.rule6ProofsEvidencePublished
			}
		]
	}
];
