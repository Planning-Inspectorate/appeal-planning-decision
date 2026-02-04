const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseEnforcementListedSubmissionUrl, params } = require('./journey');
const { APPEAL_CASE_PROCEDURE } = require('@planning-inspectorate/data-model');

const mockResponse = {
	journeyId: 'enforcement-listed-appeal-form',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('Enforcement Listed Building Appeal Form Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			// @ts-ignore
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});
	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseEnforcementListedSubmissionUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual(
			'/appeals/enforcement-listed-building/appeal-form/your-appeal?id=123'
		);
	});

	it('should set template', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTemplate).toBe('submission-form-template.njk');
	});
	it('should set journeyTitle', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTitle).toBe('Appeal a planning decision');
	});
});

describe('Enforcement Listed Building Journey - Procedure Section', () => {
	/** @type {Journey} */
	let journey;

	beforeEach(() => {
		journey = new Journey({ ...params, response: JSON.parse(JSON.stringify(mockResponse)) });
		journey.response.answers = {};
	});

	it('should include the procedure preference question', () => {
		const section = journey.getSection('prepare-appeal');
		// @ts-ignore
		const question = section.questions.find((q) => q.fieldName === 'appellantProcedurePreference');
		expect(question).toBeDefined();
	});

	it('should show hearing details only when Hearing is selected', () => {
		const section = journey.getSection('prepare-appeal');
		// @ts-ignore
		const hearingDetails = section.questions.find(
			(q) => q.fieldName === 'appellantPreferHearingDetails'
		);

		expect(hearingDetails?.shouldDisplay(journey.response)).toBe(false);

		journey.response.answers.appellantProcedurePreference = APPEAL_CASE_PROCEDURE.HEARING;
		expect(hearingDetails?.shouldDisplay(journey.response)).toBe(true);

		journey.response.answers.appellantProcedurePreference = APPEAL_CASE_PROCEDURE.INQUIRY;
		expect(hearingDetails?.shouldDisplay(journey.response)).toBe(false);
	});

	it('should show inquiry duration and witnesses only when Inquiry is selected', () => {
		const section = journey.getSection('prepare-appeal');
		// @ts-ignore
		const inquiryDays = section.questions.find(
			(q) => q.fieldName === 'appellantPreferInquiryDuration'
		);
		// @ts-ignore
		const inquiryWitnesses = section.questions.find(
			(q) => q.fieldName === 'appellantPreferInquiryWitnesses'
		);

		journey.response.answers.appellantProcedurePreference = APPEAL_CASE_PROCEDURE.INQUIRY;
		journey.response.answers.appellantPreferInquiryDetails = 'Because I want one';
		journey.response.answers.appellantPreferInquiryDuration = 5;

		expect(inquiryDays?.shouldDisplay(journey.response)).toBe(true);
		expect(inquiryWitnesses?.shouldDisplay(journey.response)).toBe(true);
	});

	it('should show linked appeals reference question only when Linked Appeals is "yes"', () => {
		const section = journey.getSection('prepare-appeal');
		// @ts-ignore
		const linkedAppealRef = section.questions.find((q) => q.fieldName === 'appellantLinkedCaseAdd');

		expect(linkedAppealRef?.shouldDisplay(journey.response)).toBe(false);

		journey.response.answers.appellantLinkedCase = 'yes';
		expect(linkedAppealRef?.shouldDisplay(journey.response)).toBe(true);
	});
});
