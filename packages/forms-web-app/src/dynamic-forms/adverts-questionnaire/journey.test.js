const { Journey } = require('@pins/dynamic-forms/src/journey');
const { casAdverts, adverts } = require('./journey');
const {
	CASE_TYPES: { ADVERTS, CAS_ADVERTS }
} = require('@pins/common/src/database/data-static');
const { mapAppealTypeToDisplayText } = require('@pins/common/src/appeal-type-to-display-text');

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
	['casAdverts', casAdverts, mockResponseCasAdverts, CAS_ADVERTS],
	['adverts', adverts, mockResponseAdverts, ADVERTS]
])('%s LPAQ Journey', (_, { baseAdvertsMinorUrl, ...params }, mockResponse, appealType) => {
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
			'<appeal type>': mapAppealTypeToDisplayText(appealType)
		});
	});
});

describe('CAS advert LPAQ sections', () => {
	it('should have the correct questions in the Constraints, designations and other issues section', () => {
		const journey = new Journey({ ...casAdverts, response: mockResponseCasAdverts });
		const CONSTRAINTS_SECTION_INDEX = 0;
		const APPEAL_TYPE_INDEX = 0;
		const AFFECT_LISTED_BUILDING_INDEX = 1;
		const AFFECT_LISTED_BUILDING_NUMBER_INDEX = 2;
		const SCHEDULED_MONUMENT_INDEX = 3;
		const CONSERVATION_AREA_INDEX = 4;
		const CONSERVATION_DOCS_INDEX = 5;
		const PROTECTED_SPECIES_INDEX = 6;
		const SPECIAL_CONTROL_ADVERT_INDEX = 7;
		const GREEN_BELT_INDEX = 8;
		const NATIONAL_LANDSCAPE_INDEX = 9;
		const DESIGNATED_SITES_INDEX = 10;

		expect(journey.sections[CONSTRAINTS_SECTION_INDEX].questions[APPEAL_TYPE_INDEX].question).toBe(
			`Is a <appeal type> appeal the correct type of appeal?`
		);
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[AFFECT_LISTED_BUILDING_INDEX].question
		).toBe('Does the proposed development affect the setting of listed buildings?');
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[AFFECT_LISTED_BUILDING_NUMBER_INDEX]
				.question
		).toBe('Add another building or site?');
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[SCHEDULED_MONUMENT_INDEX].question
		).toBe('Would the development affect a scheduled monument?');
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[CONSERVATION_AREA_INDEX].question
		).toBe('Is the site in, or next to a conservation area?');
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[CONSERVATION_DOCS_INDEX].question
		).toBe('Upload conservation map and guidance');
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[PROTECTED_SPECIES_INDEX].question
		).toBe('Would the development affect a protected species?');
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[SPECIAL_CONTROL_ADVERT_INDEX].question
		).toBe('Is the site in an area of special control of advertisements?');
		expect(journey.sections[CONSTRAINTS_SECTION_INDEX].questions[GREEN_BELT_INDEX].question).toBe(
			'Is the site in a green belt?'
		);
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[NATIONAL_LANDSCAPE_INDEX].question
		).toBe('Is the appeal site in an area of outstanding natural beauty?');
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[DESIGNATED_SITES_INDEX].question
		).toBe('Is the development in, near or likely to affect any designated sites?');
	});
});
