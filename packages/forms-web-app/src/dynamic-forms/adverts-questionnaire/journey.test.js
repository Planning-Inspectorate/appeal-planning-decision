const { Journey } = require('@pins/dynamic-forms/src/journey');
const { casAdverts, adverts } = require('./journey');
const {
	CASE_TYPES: { ADVERTS, CAS_ADVERTS }
} = require('@pins/common/src/database/data-static');

const mockResponseAdverts = {
	journeyId: 'adverts-questionnaire',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};
const mockResponseCasAdverts = {
	journeyId: 'cas-adverts-questionnaire',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe.each([
	['casAdverts', casAdverts, mockResponseCasAdverts, CAS_ADVERTS.type.toLowerCase()],
	['adverts', adverts, mockResponseAdverts, ADVERTS.type.toLowerCase()]
])('%s LPAQ Journey', (_, { baseAdvertsMinorUrl, ...params }, mockResponse, caseType) => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});

	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseAdvertsMinorUrl));
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
		// check the appeal type variable is set correctly
		expect(journey.sections[0].sectionVariables).toMatchObject({
			'<appeal type>': caseType.toLowerCase()
		});
	});
});
