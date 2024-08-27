const { Journey } = require('../journey');
const { baseS78StatementUrl, buildJourneyParams } = require('./journey');

const mockResponse = {
	referenceId: '123',
	answers: []
};

describe('S78 Journey class', () => {
	describe('constructor', () => {
		it('should error if no response', () => {
			expect(() => {
				new Journey(...buildJourneyParams());
			}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
		});

		it('should set baseUrl', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(journey.baseUrl).toEqual(expect.stringContaining(baseS78StatementUrl));
			expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
		});

		it('should set taskListUrl', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(journey.taskListUrl).toEqual('/manage-appeals/appeal-statement/123');
		});

		it('should set template', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(journey.journeyTemplate).toBe('statement-template.njk');
		});

		it('should set listingPageViewPath', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(journey.listingPageViewPath).toBe('dynamic-components/task-list/statement');
		});

		it('should set journeyTitle', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(journey.journeyTitle).toBe('Manage your appeals');
		});

		it('should define sections and questions', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(Array.isArray(journey.sections)).toBe(true);
			expect(journey.sections.length > 0).toBe(true);
			expect(Array.isArray(journey.sections[0].questions)).toBe(true);
			expect(journey.sections[0].questions.length > 0).toBe(true);
		});
	});
});
