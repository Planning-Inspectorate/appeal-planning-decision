const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseEnforcementSubmissionUrl, ...params } = require('./journey');

const mockResponse = {
	journeyId: 'enforcement-appeal-form',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('Enforcement Appeal Form Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});
	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseEnforcementSubmissionUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual('/appeals/enforcement/appeal-form/your-appeal?id=123');
	});

	it('should set template', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTemplate).toBe('submission-form-template.njk');
	});
	it('should set journeyTitle', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTitle).toBe('Appeal a planning decision');
	});
});
