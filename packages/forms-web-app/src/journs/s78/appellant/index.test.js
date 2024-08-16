const { S78AppealFormJourney, baseS78SubmissionUrl } = require('.');

const mockResponse = {
	referenceId: '123',
	answers: []
};

describe('HAS Appeal Form Journey class', () => {
	describe('constructor', () => {
		it('should error if no response', () => {
			expect(() => {
				new S78AppealFormJourney();
			}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
		});
		it('should set baseUrl', () => {
			const journey = new S78AppealFormJourney(mockResponse);
			expect(journey.baseUrl).toEqual(expect.stringContaining(baseS78SubmissionUrl));
			expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
		});

		it('should set taskListUrl', () => {
			const journey = new S78AppealFormJourney(mockResponse);
			expect(journey.taskListUrl).toEqual('/appeals/full-planning/appeal-form/your-appeal?id=123');
		});

		it('should set template', () => {
			const journey = new S78AppealFormJourney(mockResponse);
			expect(journey.journeyTemplate).toBe('submission-form-template.njk');
		});
		it('should set journeyTitle', () => {
			const journey = new S78AppealFormJourney(mockResponse);
			expect(journey.journeyTitle).toBe('Appeal a planning decision');
		});
	});
});
