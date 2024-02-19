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
				text: 'View appeal details',
				condition: (appealCase) => appealCase.casePublished
			}
		]
	}
];
