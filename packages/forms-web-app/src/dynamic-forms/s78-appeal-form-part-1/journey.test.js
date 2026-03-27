const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseS78SubmissionUrl, ...params } = require('./journey');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

const mockResponse = {
	journeyId: JOURNEY_TYPES.S78_PART_1_APPEAL_FORM.id,
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('S78 Appeal Form Part 1 Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});
	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseS78SubmissionUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual('/appeals/full-planning/appeal-form/your-appeal?id=123');
	});

	it('should set template', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTemplate).toBe('submission-form-template.njk');
	});
	it('should set journeyTitle', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTitle).toBe('Appeal a planning decision');
	});

	it('should display whyAreYouAppealing and anySignificantChanges questions', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		const prepareSection = journey.sections.find((s) => s.segment === 'prepare-appeal');

		const whyAreYouAppealing = prepareSection.questions.find(
			(q) => q.fieldName === 'whyAreYouAppealing'
		);
		const anySignificantChanges = prepareSection.questions.find(
			(q) => q.fieldName === 'anySignificantChanges'
		);

		expect(whyAreYouAppealing).toBeDefined();
		expect(anySignificantChanges).toBeDefined();
	});
});
