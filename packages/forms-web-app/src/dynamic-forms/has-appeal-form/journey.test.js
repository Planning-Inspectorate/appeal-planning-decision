const { Journey } = require('../journey');
const { buildJourneyParams, baseHASSubmissionUrl } = require('./journey');

const mockResponse = {
	journeyId: 'HAS',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('HAS Appeal Form Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(...buildJourneyParams());
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});
	it('should set baseUrl', () => {
		const journey = new Journey(...buildJourneyParams(mockResponse));
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseHASSubmissionUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey(...buildJourneyParams(mockResponse));
		expect(journey.taskListUrl).toEqual('/appeals/householder/appeal-form/your-appeal?id=123');
	});

	it('should set template', () => {
		const journey = new Journey(...buildJourneyParams(mockResponse));
		expect(journey.journeyTemplate).toBe('submission-form-template.njk');
	});
	it('should set journeyTitle', () => {
		const journey = new Journey(...buildJourneyParams(mockResponse));
		expect(journey.journeyTitle).toBe('Appeal a planning decision');
	});
});
