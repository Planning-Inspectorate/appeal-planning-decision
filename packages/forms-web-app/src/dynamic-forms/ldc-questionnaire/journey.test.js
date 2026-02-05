const { Journey } = require('@pins/dynamic-forms/src/journey');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { baseLdcSubmissionUrl, ...params } = require('./journey');
const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');

const mockResponse = {
	journeyId: JOURNEY_TYPES.LDC_QUESTIONNAIRE.id,
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('Lawful development certificate LPAQ Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});

	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseLdcSubmissionUrl));
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

	describe('LDC Journey - Site access Section', () => {
		/** @type {Journey} */
		let journey;

		beforeEach(() => {
			journey = new Journey({ ...params, response: JSON.parse(JSON.stringify(mockResponse)) });
			journey.response.answers = {};
		});

		it('should show addNeighbourSite only when addNeighbourSiteAccess is "yes"', () => {
			const section = journey.getSection('site-access');
			const addNeighbourSite = section?.questions.find(
				(q) => q.fieldName === 'addNeighbourSiteAccess'
			);

			expect(addNeighbourSite?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.neighbourSiteAccess = 'yes';
			expect(addNeighbourSite?.shouldDisplay(journey.response)).toBe(true);

			journey.response.answers.neighbourSiteAccess = 'no';
			expect(addNeighbourSite?.shouldDisplay(journey.response)).toBe(false);
		});
	});

	describe('LDC Journey - Procedure Section', () => {
		/** @type {Journey} */
		let journey;

		beforeEach(() => {
			journey = new Journey({ ...params, response: JSON.parse(JSON.stringify(mockResponse)) });
			journey.response.answers = {};
		});

		it('should show hearing details only when Hearing is selected', () => {
			const section = journey.getSection('appeal-process');
			const hearingDetails = section?.questions.find(
				(q) => q.fieldName === 'lpaPreferHearingDetails'
			);

			expect(hearingDetails?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.lpaProcedurePreference = APPEAL_CASE_PROCEDURE.HEARING;
			expect(hearingDetails?.shouldDisplay(journey.response)).toBe(true);

			journey.response.answers.lpaProcedurePreference = APPEAL_CASE_PROCEDURE.INQUIRY;
			expect(hearingDetails?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should show inquiry details only when Inquiry is selected', () => {
			const section = journey.getSection('appeal-process');
			const inquiryDetails = section?.questions.find(
				(q) => q.fieldName === 'lpaPreferInquiryDetails'
			);

			expect(inquiryDetails?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.lpaProcedurePreference = APPEAL_CASE_PROCEDURE.HEARING;
			expect(inquiryDetails?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.lpaProcedurePreference = APPEAL_CASE_PROCEDURE.INQUIRY;
			expect(inquiryDetails?.shouldDisplay(journey.response)).toBe(true);
		});

		it('should show linked appeals reference question only when Linked Appeals is "yes"', () => {
			const section = journey.getSection('appeal-process');
			const linkedAppealRef = section?.questions.find((q) => q.fieldName === 'addNearbyAppeal');

			expect(linkedAppealRef?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.nearbyAppeals = 'yes';
			expect(linkedAppealRef?.shouldDisplay(journey.response)).toBe(true);
		});
	});
});
