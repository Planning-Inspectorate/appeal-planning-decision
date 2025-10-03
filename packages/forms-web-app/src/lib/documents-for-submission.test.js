const { APPEAL_ID } = require('@pins/business-rules/src/constants');
const {
	generateRequiredDocuments,
	generateOptionalDocuments
} = require('./documents-for-submission');

describe('required documents-for-submission', () => {
	const testCases = [
		[
			APPEAL_ID.PLANNING_SECTION_78,
			[
				'planning application form',
				'plans, drawings and supporting documents for your application',
				'new plans or drawings to support your appeal',
				'other documents to support your appeal'
			]
		],
		[
			APPEAL_ID.PLANNING_LISTED_BUILDING,
			[
				'planning application form',
				'plans, drawings and supporting documents for your application',
				'new plans or drawings to support your appeal',
				'other documents to support your appeal'
			]
		],
		[
			APPEAL_ID.MINOR_COMMERCIAL,
			['planning application form', 'plans, drawings and supporting documents for your application']
		],
		[
			APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT,
			[
				'application form',
				'plans, drawings and supporting documents for your application',
				'decision letter from the local authority',
				'any other relevant correspondence with the local authority'
			]
		],
		[
			APPEAL_ID.ADVERTISEMENT,
			[
				'application form',
				'plans, drawings and supporting documents for your application',
				'decision letter from the local authority',
				'any other relevant correspondence with the local authority'
			]
		]
	];

	it.each(testCases)(
		'should return correct required documents for appeal type %s',
		(appealType, expected) => {
			const result = generateRequiredDocuments(appealType);
			expect(result).toEqual(expected);
		}
	);
});

describe('optional documents-for-submission', () => {
	const testCases = [
		[
			APPEAL_ID.PLANNING_SECTION_78,
			[
				'decision letter from the local authority',
				'planning obligation',
				'separate ownership certificate and agricultural land declaration',
				'draft statement of common ground',
				'design and access statement',
				'appeal statement (including the reason for your appeal and the reasons why you think the local planning authority’s decision is wrong)'
			]
		],
		[
			APPEAL_ID.PLANNING_LISTED_BUILDING,
			[
				'decision letter from the local authority',
				'planning obligation',
				'separate ownership certificate and agricultural land declaration',
				'draft statement of common ground',
				'design and access statement',
				'appeal statement (including the reason for your appeal and the reasons why you think the local planning authority’s decision is wrong)'
			]
		],
		[
			APPEAL_ID.MINOR_COMMERCIAL,
			[
				'decision letter from the local authority',
				'design and access statement',
				'appeal statement (including the reason for your appeal and the reasons why you think the local planning authority’s decision is wrong)'
			]
		],
		[APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT, undefined],
		[APPEAL_ID.ADVERTISEMENT, undefined]
	];

	it.each(testCases)(
		'should return correct required documents for appeal type %s',
		(appealType, expected) => {
			const result = generateOptionalDocuments(appealType);
			expect(result).toEqual(expected);
		}
	);
});
