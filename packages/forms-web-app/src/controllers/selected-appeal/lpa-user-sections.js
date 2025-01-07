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
				condition: (appealCase) => !!appealCase.lpaStatementPublished
			},
			{
				url: '/other-party-statements',
				text: 'View other party statements',
				condition: (appealCase) => !!appealCase.rule6StatementPublished
			}
		]
	},
	{
		heading: 'Interested party comments',
		links: [
			{
				url: '/interested-party-comments',
				text: 'View interested party comments',
				condition: (appealCase) => !!appealCase.interestedPartyCommentsPublished
			}
		]
	},
	{
		heading: 'Final comments',
		links: [
			{
				url: '/final-comments',
				text: 'View your final comments',
				condition: (appealCase) => !!appealCase.lpaFinalCommentsPublished
			},
			{
				url: '/appellant-final-comments',
				text: 'View appellant final comments',
				condition: (appealCase) => !!appealCase.appellantFinalCommentsSubmitted
			}
		]
	},
	{
		heading: 'Planning obligation',
		links: [
			{
				url: '/appellant-planning-obligation',
				text: 'View the appellant’s planning obligation',
				condition: (appealCase) => !!appealCase.planningObligation
			}
		]
	},
	{
		heading: 'Proof of evidence and witnesses',
		links: [
			{
				url: '/proof-evidence',
				text: 'View your proof of evidence and witnesses',
				condition: (appealCase) => !!appealCase.lpaProofEvidencePublished
			},
			{
				url: '/appellant-proof-evidence',
				text: "View the appellant's proof of evidence and witnesses",
				condition: (appealCase) => !!appealCase.appellantProofEvidencePublished
			},
			{
				url: '/other-party-proof-evidence',
				text: 'View proof of evidence and witnesses from other parties',
				condition: (appealCase) => !!appealCase.rule6ProofsEvidencePublished
			}
		]
	}
	// ToDo - Witness timings? On prototype but not included in tickets
];
