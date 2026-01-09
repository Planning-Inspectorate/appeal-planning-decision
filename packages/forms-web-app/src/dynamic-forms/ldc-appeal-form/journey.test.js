const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseLdcSubmissionUrl, ...params } = require('./journey');

const mockResponse = {
	journeyId: 'ldc-appeal-form',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('Lawful development certificate Appeal Form Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});
	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseLdcSubmissionUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual('/appeals/ldc/appeal-form/your-appeal?id=123');
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
