const { S78Journey, baseS78Url } = require('.');

const mockResponse = {
	referenceId: '123',
	answers: []
};

describe('S78 Journey class', () => {
	describe('constructor', () => {
		it('should error if no response', () => {
			expect(() => {
				new S78Journey();
			}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
		});

		it('should set baseUrl', () => {
			const journey = new S78Journey(mockResponse);
			expect(journey.baseUrl).toEqual(expect.stringContaining(baseS78Url));
			expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
		});

		it('should set taskListUrl', () => {
			const journey = new S78Journey(mockResponse);
			expect(journey.taskListUrl).toEqual('/manage-appeals/questionnaire/123');
		});

		it('should set template', () => {
			const journey = new S78Journey(mockResponse);
			expect(journey.journeyTemplate).toBe('questionnaire-template.njk');
		});

		it('should set listingPageViewPath', () => {
			const journey = new S78Journey(mockResponse);
			expect(journey.listingPageViewPath).toBe('dynamic-components/task-list/questionnaire');
		});

		it('should set journeyTitle', () => {
			const journey = new S78Journey(mockResponse);
			expect(journey.journeyTitle).toBe('Manage your appeals');
		});

		it('should define sections and questions', () => {
			const journey = new S78Journey(mockResponse);
			expect(Array.isArray(journey.sections)).toBe(true);
			expect(journey.sections.length > 0).toBe(true);
			expect(Array.isArray(journey.sections[0].questions)).toBe(true);
			expect(journey.sections[0].questions.length > 0).toBe(true);
		});
	});
});
