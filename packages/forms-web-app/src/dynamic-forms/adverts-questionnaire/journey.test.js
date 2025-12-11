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
		// check the appeal type variables are set correctly
		const appealTypeDisplayText =
			appealType === CAS_ADVERTS ? 'commercial advertisement' : 'advertisement';
		const appealTypeDisplayTextWithAnOrA =
			appealType === CAS_ADVERTS ? 'a commercial advertisement' : 'an advertisement';

		expect(journey.sections[0].sectionVariables).toMatchObject({
			'<appeal type with an or a>': appealTypeDisplayTextWithAnOrA,
			'<appeal type>': appealTypeDisplayText
		});
	});
});

describe.each([
	['casAdverts', casAdverts, mockResponseCasAdverts],
	['adverts', adverts, mockResponseAdverts]
])('%s LPAQ Sections', (_, appealParams, mockResponse) => {
	const journey = new Journey({ ...appealParams, response: mockResponse });

	it('should have the correct questions in the Constraints, designations and other issues section', () => {
		const CONSTRAINTS_SECTION_INDEX = 0;
		const APPEAL_TYPE_INDEX = 0;
		const CHANGE_LISTED_BUILDING_INDEX = 1;
		const CHANGE_LISTED_BUILDING_NUMBER_INDEX = 2;
		const AFFECT_LISTED_BUILDING_INDEX = 3;
		const AFFECT_LISTED_BUILDING_NUMBER_INDEX = 4;
		const SCHEDULED_MONUMENT_INDEX = 5;
		const CONSERVATION_AREA_INDEX = 6;
		const CONSERVATION_DOCS_INDEX = 7;
		const PROTECTED_SPECIES_INDEX = 8;
		const SPECIAL_CONTROL_ADVERT_INDEX = 9;
		const GREEN_BELT_INDEX = 10;
		const NATIONAL_LANDSCAPE_INDEX = 11;
		const DESIGNATED_SITES_INDEX = 12;

		expect(journey.sections[CONSTRAINTS_SECTION_INDEX].questions[APPEAL_TYPE_INDEX].question).toBe(
			`Is <appeal type with an or a> appeal the correct type of appeal?`
		);
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[CHANGE_LISTED_BUILDING_INDEX].question
		).toBe('Does the development change a listed building?');
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[CHANGE_LISTED_BUILDING_NUMBER_INDEX]
				.question
		).toBe('Add another building or site?');
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[AFFECT_LISTED_BUILDING_INDEX].question
		).toBe('Does the alleged development affect the setting of listed buildings?');
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
		).toBe('Is the site in a national landscape?');
		expect(
			journey.sections[CONSTRAINTS_SECTION_INDEX].questions[DESIGNATED_SITES_INDEX].question
		).toBe('Is the development in, near or likely to affect any designated sites?');
	});

	it('should have the correct questions in the Notifying relevant parties section', () => {
		const NOTIFYING_SECTION_INDEX = 1;
		const NOTIFYING_APPLICATION_INDEX = 0;
		const HOW_NOTIFIED_INDEX = 1;
		const SITE_NOTICE_INDEX = 2;
		const LETTERS_EMAILS_INDEX = 3;
		const PRESS_ADVERT_INDEX = 4;
		const NOTIFICATION_LETTER_INDEX = 5;

		expect(
			journey.sections[NOTIFYING_SECTION_INDEX].questions[NOTIFYING_APPLICATION_INDEX].question
		).toBe('Who did you notify about this application?');
		expect(journey.sections[NOTIFYING_SECTION_INDEX].questions[HOW_NOTIFIED_INDEX].question).toBe(
			'How did you notify relevant parties about the planning application?'
		);
		expect(journey.sections[NOTIFYING_SECTION_INDEX].questions[SITE_NOTICE_INDEX].question).toBe(
			'Upload the site notice'
		);
		expect(journey.sections[NOTIFYING_SECTION_INDEX].questions[LETTERS_EMAILS_INDEX].question).toBe(
			'Upload letters or emails sent to interested parties with their addresses'
		);
		expect(journey.sections[NOTIFYING_SECTION_INDEX].questions[PRESS_ADVERT_INDEX].question).toBe(
			'Upload the press advertisement'
		);
		expect(
			journey.sections[NOTIFYING_SECTION_INDEX].questions[NOTIFICATION_LETTER_INDEX].question
		).toBe('Upload the appeal notification letter and the list of people that you notified');
	});

	it('should have the correct questions in the Consultation responses and representations section', () => {
		const CONSULTATION_SECTION_INDEX = 2;
		const CONSULTEES_INDEX = 0;
		const ANY_REPRESENTATIONS_INDEX = 1;
		const REPRESENTATIONS_UPLOAD_INDEX = 2;

		expect(journey.sections[CONSULTATION_SECTION_INDEX].questions[CONSULTEES_INDEX].question).toBe(
			'Did you consult all the relevant statutory consultees about the development?'
		);
		expect(
			journey.sections[CONSULTATION_SECTION_INDEX].questions[ANY_REPRESENTATIONS_INDEX].question
		).toBe('Did you receive representations from members of the public or other parties?');
		expect(
			journey.sections[CONSULTATION_SECTION_INDEX].questions[REPRESENTATIONS_UPLOAD_INDEX].question
		).toBe('Upload the representations');
	});

	it('should have the correct questions in the Planning officer’s report and supporting documents section', () => {
		const PLANNING_OFFICER_SECTION_INDEX = 3;
		const REPORT_INDEX = 0;
		const HIGHWAY_SAFETY_INDEX = 1;
		const PHOTOS_AND_PLANS_INDEX = 2;
		const POLICIES_INDEX = 3;
		const UPLOAD_POLICIES_INDEX = 4;
		const EMERGING_PLAN_INDEX = 5;
		const UPLOAD_EMERGING_PLAN_INDEX = 6;
		const OTHER_POLICIES_INDEX = 7;
		const UPLOAD_OTHER_POLICIES_INDEX = 8;
		const SUPPLIMENTARY_DOCS_INDEX = 9;
		const UPLOAD_SUPPLIMENTARY_DOCS_INDEX = 10;

		expect(journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[REPORT_INDEX].question).toBe(
			'Upload the planning officer’s report or what your decision notice would have said'
		);
		expect(
			journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[HIGHWAY_SAFETY_INDEX].question
		).toBe('Did you refuse the application because of highway or traffic public safety?');
		expect(
			journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[PHOTOS_AND_PLANS_INDEX].question
		).toBe('Did the appellant submit complete and accurate photographs and plans?');
		expect(
			journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[POLICIES_INDEX].question
		).toBe('Do you have any relevant policies from your statutory development plan?');
		expect(
			journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[UPLOAD_POLICIES_INDEX].question
		).toBe('Upload relevant policies from your statutory development plan');
		expect(
			journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[EMERGING_PLAN_INDEX].question
		).toBe('Do you have an emerging plan that is relevant to this appeal?');
		expect(
			journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[UPLOAD_EMERGING_PLAN_INDEX]
				.question
		).toBe('Upload the emerging plan and supporting information');
		expect(
			journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[OTHER_POLICIES_INDEX].question
		).toBe('Do you have any other relevant policies to upload?');
		expect(
			journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[UPLOAD_OTHER_POLICIES_INDEX]
				.question
		).toBe('Upload any other relevant policies');
		expect(
			journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[SUPPLIMENTARY_DOCS_INDEX].question
		).toBe(
			'Did any supplementary planning documents inform the outcome of the planning application?'
		);
		expect(
			journey.sections[PLANNING_OFFICER_SECTION_INDEX].questions[UPLOAD_SUPPLIMENTARY_DOCS_INDEX]
				.question
		).toBe('Upload relevant policy extracts and supplementary planning documents');
	});

	it('should have the correct questions in the Site access section', () => {
		const SITE_ACCESS_SECTION_INDEX = 4;
		const INSPECTOR_ACCESS_INDEX = 0;
		const NEIGHBOUR_ACCESS_INDEX = 1;
		const NEIGHBOUR_ADDRESS_INDEX = 2;
		const SAFETY_RISK_INDEX = 3;

		expect(
			journey.sections[SITE_ACCESS_SECTION_INDEX].questions[INSPECTOR_ACCESS_INDEX].question
		).toBe('Will the inspector need access to the appellant’s land or property?');
		expect(
			journey.sections[SITE_ACCESS_SECTION_INDEX].questions[NEIGHBOUR_ACCESS_INDEX].question
		).toBe('Will the inspector need to enter a neighbour’s land or property?');
		expect(
			journey.sections[SITE_ACCESS_SECTION_INDEX].questions[NEIGHBOUR_ADDRESS_INDEX].question
		).toBe('Do you want to add another neighbour to be visited?');
		expect(journey.sections[SITE_ACCESS_SECTION_INDEX].questions[SAFETY_RISK_INDEX].question).toBe(
			'Add potential safety risks'
		);
	});

	it('should have the correct questions in the Appeal process section', () => {
		const APPEAL_PROCESS_SECTION_INDEX = 5;
		const PROCEDURE_TYPE_INDEX = 0;
		const INQUIRY_INDEX = 1;
		const HEARING_INDEX = 2;
		const ONGOING_APPEALS_INDEX = 3;
		const ONGOING_APPEALS_REF_INDEX = 4;
		const NEW_CONDITIONS_INDEX = 5;

		expect(
			journey.sections[APPEAL_PROCESS_SECTION_INDEX].questions[PROCEDURE_TYPE_INDEX].question
		).toBe('Which procedure do you think is most appropriate for this appeal?');
		expect(journey.sections[APPEAL_PROCESS_SECTION_INDEX].questions[INQUIRY_INDEX].question).toBe(
			'Why would you prefer an inquiry?'
		);
		expect(journey.sections[APPEAL_PROCESS_SECTION_INDEX].questions[HEARING_INDEX].question).toBe(
			'Why would you prefer a hearing?'
		);
		expect(
			journey.sections[APPEAL_PROCESS_SECTION_INDEX].questions[ONGOING_APPEALS_INDEX].question
		).toBe('Are there any other ongoing appeals next to, or close to the site?');
		expect(
			journey.sections[APPEAL_PROCESS_SECTION_INDEX].questions[ONGOING_APPEALS_REF_INDEX].question
		).toBe('Add another appeal?');
		expect(
			journey.sections[APPEAL_PROCESS_SECTION_INDEX].questions[NEW_CONDITIONS_INDEX].question
		).toBe('Check if there are any new conditions');
	});
});

describe('Correctly display the fields which depend on the appeal type', () => {
	it('should not display the change listed building for CAS adverts appeals', () => {
		const journey = new Journey({
			...casAdverts,
			response: {
				...mockResponseCasAdverts
			}
		});
		expect(
			journey.sections[0].questions
				.find((question) =>
					question.title.includes('Does the development change a listed building?')
				)
				?.shouldDisplay({
					...mockResponseCasAdverts
				})
		).toBe(false);
	});

	it('should display the change listed building for adverts appeals', () => {
		const journey = new Journey({
			...adverts,
			response: {
				...mockResponseAdverts
			}
		});
		expect(
			journey.sections[0].questions
				.find((question) =>
					question.title.includes('Does the development change a listed building?')
				)
				?.shouldDisplay({
					...mockResponseAdverts
				})
		).toBe(true);
	});
});
