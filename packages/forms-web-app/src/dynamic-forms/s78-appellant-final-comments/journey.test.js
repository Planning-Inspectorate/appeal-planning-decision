const { Journey } = require('../journey');
const { baseAppellantFinalCommentUrl, buildJourneyParams } = require('./journey');

const mockResponse = {
	referenceId: '123',
	answers: []
};

describe('S78 Final Comments Journey class', () => {
	describe('constructor', () => {
		it('should error if no response', () => {
			expect(() => {
				new Journey(...buildJourneyParams());
			}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
		});

		it('should set baseUrl', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(journey.baseUrl).toEqual(expect.stringContaining(baseAppellantFinalCommentUrl));
			expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
		});

		it('should set taskListUrl', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(journey.taskListUrl).toEqual('/appeals/final-comments/123');
		});

		it('should set template', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(journey.journeyTemplate).toBe('final-comments-template.njk');
		});

		it('should set listingPageViewPath', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(journey.listingPageViewPath).toBe('dynamic-components/task-list/final-comments');
		});

		it('should set journeyTitle', () => {
			const journey = new Journey(...buildJourneyParams(mockResponse));
			expect(journey.journeyTitle).toBe('Appeal a planning decision');
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