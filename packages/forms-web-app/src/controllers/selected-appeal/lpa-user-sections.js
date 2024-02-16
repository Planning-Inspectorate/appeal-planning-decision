/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 */

/**
 * @type {import('./section').Section}
 */

exports.sections = [
	{
		heading: 'Appeal details',
		links: [
			{
				url: 'anything',
				text: 'View appeal details',
				condition: (appealCase) => appealCase.casePublished
			}
		]
	},
	{
		heading: 'Questionnaire',
		links: [
			{
				url: 'anything',
				text: 'View questionnaire',
				condition: (appealCase) => appealCase.lpaQuestionnairePublished
			}
		]
	},
	{
		heading: 'Statements',
		links: [
			{
				url: 'anything',
				text: 'View your statement',
				condition: (appealCase) => appealCase.lpaStatementPublished
			},
			{
				url: 'anything',
				text: 'View other party statements',
				condition: (appealCase) => appealCase.rule6StatementPublished
			}
		]
	},
	{
		heading: 'Interested party comments',
		links: [
			{
				url: 'anything',
				text: 'View interested party comments',
				condition: (appealCase) => appealCase.interestedPartyCommentsPublished
			}
		]
	},
	{
		heading: 'Final comments',
		links: [
			{
				url: 'anything',
				text: 'View your final comments',
				condition: (appealCase) => appealCase.lpaFinalCommentsPublished
			},
			{
				url: 'anything',
				text: 'View appellant final comments',
				condition: (appealCase) => appealCase.appellantFinalCommentsSubmitted
			}
		]
	},
	{
		heading: 'Proof of evidence and witnesses',
		links: [
			{
				url: 'anything',
				text: 'View your proof of evidence and witnesses',
				condition: (appealCase) => appealCase.lpaProofEvidencePublished
			},
			{
				url: 'anything',
				text: 'View the appellant proof of evidence and witnesses',
				condition: (appealCase) => appealCase.appellantProofEvidencePublished
			},
			{
				url: 'anything',
				text: 'View proof of evidence and witnesses from other parties',
				condition: (appealCase) => appealCase.rule6ProofsEvidencePublished
			}
		]
	}
	// ToDo - Witness timings? On prototype but not included in tickets
];
