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
				condition: (appealCase) => appealCase.lpaQuestionnaireSubmitted
			}
		]
	},
	{
		heading: 'Statements',
		links: [
			{
				url: '/lpa-statement',
				text: 'View your statement',
				condition: (appealCase) => appealCase.lpaStatementPublished
			},
			{
				url: '/rule-6-statements',
				text: 'View other party statements',
				condition: (appealCase) => appealCase.rule6StatementPublished
			}
		]
	},
	{
		heading: 'Interested party comments',
		links: [
			{
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
				url: '/final-comments',
				text: 'View your final comments',
				condition: (appealCase) => appealCase.lpaFinalCommentsPublished
			},
			{
				url: '/appellant-final-comments',
				text: 'View appellant final comments',
				condition: (appealCase) => appealCase.appellantFinalCommentsSubmitted
			}
		]
	},
	{
		heading: 'Proof of evidence and witnesses',
		links: [
			{
				url: '/lpa-proof-of-evidences',
				text: 'View your proof of evidence and witnesses',
				condition: (appealCase) => appealCase.lpaProofEvidencePublished
			},
			{
				url: '/proof-of-evidences',
				text: "View the appellant's proof of evidence and witnesses",
				condition: (appealCase) => appealCase.appellantProofEvidencePublished
			},
			{
				url: '/rule-6-proof-of-evidences',
				text: 'View proof of evidence and witnesses from other parties',
				condition: (appealCase) => appealCase.rule6ProofsEvidencePublished
			}
		]
	}
	// ToDo - Witness timings? On prototype but not included in tickets
];
