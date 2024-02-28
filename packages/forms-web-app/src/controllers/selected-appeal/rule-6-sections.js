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
				text: 'View appeal details',
				condition: (appealCase) => appealCase.casePublished
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
				condition: (appealCase) => appealCase.lpaQuestionnairePublished // schema matched ticket
			}
		]
	},
	{
		heading: 'Statements',
		links: [
			{
				url: '/your-statement',
				text: 'View your statement',
				condition: (appealCase, userEmail) => {
					const currentRule6User = appealCase.Rule6Parties?.find(
						(party) => party.partyEmail === userEmail
					);
					return currentRule6User?.statementReceived;
				}
			},
			{
				url: '/statement',
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
				url: '/ip-comments',
				text: 'View interested party comments',
				condition: (appealCase) => appealCase.interestedPartyCommentsPublished // schema matched ticket
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
				condition: (appealCase, userEmail) => {
					const currentRule6User = appealCase.Rule6Parties?.find(
						(party) => party.partyEmail === userEmail
					);
					return currentRule6User?.proofEvidenceReceived;
				}
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
