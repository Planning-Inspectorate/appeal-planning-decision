const { HasAppealFormJourney, baseHASSubmissionUrl } = require('.');

const mockResponse = {
	referenceId: '123',
	answers: []
};

describe('HAS Appeal Form Journey class', () => {
	describe('constructor', () => {
		it('should error if no response', () => {
			expect(() => {
				new HasAppealFormJourney();
			}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
		});
		it('should set baseUrl', () => {
			const journey = new HasAppealFormJourney(mockResponse);
			expect(journey.baseUrl).toEqual(expect.stringContaining(baseHASSubmissionUrl));
			expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
		});

		it('should set taskListUrl', () => {
			const journey = new HasAppealFormJourney(mockResponse);
			expect(journey.taskListUrl).toEqual('/appeals/householder/appeal-form/your-appeal?id=123');
		});

		it('should set template', () => {
			const journey = new HasAppealFormJourney(mockResponse);
			expect(journey.journeyTemplate).toBe('submission-form-template.njk');
		});
		it('should set journeyTitle', () => {
			const journey = new HasAppealFormJourney(mockResponse);
			expect(journey.journeyTitle).toBe('Appeal a planning decision');
		});
	});
});
