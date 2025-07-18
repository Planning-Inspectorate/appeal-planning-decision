const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseCASPlanningUrl, ...params } = require('./journey');

const mockResponse = {
	journeyId: 'CAS_PLANNING',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('CAS Planning LPAQ Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});

	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseCASPlanningUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual('/manage-appeals/questionnaire/123');
	});

	it('should set template', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTemplate).toBe('questionnaire-template.njk');
	});

	it('should set listingPageViewPath', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.listingPageViewPath).toBe('dynamic-components/task-list/questionnaire');
	});

	it('should set informationPageViewPath', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.informationPageViewPath).toBe('dynamic-components/submission-information/index');
	});

	it('should set journeyTitle', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTitle).toBe('Manage your appeals');
	});

	it('should define sections and questions', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(Array.isArray(journey.sections)).toBe(true);
		expect(journey.sections.length > 0).toBe(true);
		expect(Array.isArray(journey.sections[0].questions)).toBe(true);
		expect(journey.sections[0].questions.length > 0).toBe(true);
	});
});
