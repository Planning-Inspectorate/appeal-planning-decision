/**
 * @type {import('./section').Section}
 */
exports.sections = [
	{
		heading: 'Questionnaire',
		links: [
			{
				url: 'anything',
				text: 'View questionnaire',
				condition: (appealCase) => appealCase.hasQuestionnaire
			},
			{
				url: 'anything',
				text: 'Do something else',
				condition: (appealCase) => appealCase.hasOtherThing
			}
		]
	},
	{
		heading: 'Next thing',
		links: [
			{
				url: 'anything',
				text: 'Do something else',
				condition: (appealCase) => appealCase.hasThis
			}
		]
	},
	{
		heading: 'Last thing',
		links: [
			{
				url: 'anything',
				text: 'Do something else',
				condition: (appealCase) => appealCase.hasThat
			}
		]
	}
];
