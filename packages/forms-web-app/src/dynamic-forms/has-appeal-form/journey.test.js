const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseHASSubmissionUrl, ...params } = require('./journey');

const mockResponse = {
	journeyId: 'HAS',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('HAS Appeal Form Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});
	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseHASSubmissionUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual('/appeals/householder/appeal-form/your-appeal?id=123');
	});

	it('should set template', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTemplate).toBe('submission-form-template.njk');
	});
	it('should set journeyTitle', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTitle).toBe('Appeal a planning decision');
	});

	it('should include significant changes question before other appeals', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		const section = journey.getSection('prepare-appeal');
		const significantChangesIndex = section.questions.findIndex(
			(question) => question.fieldName === 'anySignificantChanges'
		);
		const otherAppealsIndex = section.questions.findIndex(
			(question) => question.fieldName === 'appellantLinkedCaseAdd'
		);

		expect(significantChangesIndex).toBeGreaterThan(-1);
		expect(otherAppealsIndex).toBeGreaterThan(-1);
		expect(significantChangesIndex).toBeLessThan(otherAppealsIndex);
	});
});
