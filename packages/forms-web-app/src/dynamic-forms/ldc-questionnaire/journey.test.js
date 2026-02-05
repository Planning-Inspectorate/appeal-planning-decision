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

	describe('LDC Journey - Constraints, designations and other issues section', () => {
		/** @type {Journey} */
		let journey;

		beforeEach(() => {
			journey = new Journey({ ...params, response: JSON.parse(JSON.stringify(mockResponse)) });
			journey.response.answers = {};
		});

		it('should show previousPlanningPermissionUpload only when planningCondition is "yes"', () => {
			const section = journey.getSection('constraints');
			const previousPlanningPermissionUpload = section?.questions.find(
				(q) => q.fieldName === 'previousPlanningPermissionUpload'
			);

			expect(previousPlanningPermissionUpload?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.planningCondition = 'yes';
			expect(previousPlanningPermissionUpload?.shouldDisplay(journey.response)).toBe(true);

			journey.response.answers.planningCondition = 'no';
			expect(previousPlanningPermissionUpload?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should show noticeDateApplicationUpload only when noticeDateApplication is "yes"', () => {
			const section = journey.getSection('constraints');
			const noticeDateApplicationUpload = section?.questions.find(
				(q) => q.fieldName === 'noticeDateApplicationUpload'
			);

			expect(noticeDateApplicationUpload?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.noticeDateApplication = 'yes';
			expect(noticeDateApplicationUpload?.shouldDisplay(journey.response)).toBe(true);

			journey.response.answers.noticeDateApplication = 'no';
			expect(noticeDateApplicationUpload?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should show relatedApplicationsUpload only when relatedApplications is "yes"', () => {
			const section = journey.getSection('constraints');
			const relatedApplicationsUpload = section?.questions.find(
				(q) => q.fieldName === 'relatedApplicationsUpload'
			);

			expect(relatedApplicationsUpload?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.relatedApplications = 'yes';
			expect(relatedApplicationsUpload?.shouldDisplay(journey.response)).toBe(true);

			journey.response.answers.relatedApplications = 'no';
			expect(relatedApplicationsUpload?.shouldDisplay(journey.response)).toBe(false);
		});
	});

	describe("LDC Journey - Planning officer's report and supporting documents section", () => {
		/** @type {Journey} */
		let journey;

		beforeEach(() => {
			journey = new Journey({ ...params, response: JSON.parse(JSON.stringify(mockResponse)) });
			journey.response.answers = {};
		});

		it('should show uploadPlanningOfficerReport only when planningOfficerReport is "yes"', () => {
			const section = journey.getSection('planning-officer-report');
			const uploadPlanningOfficerReport = section?.questions.find(
				(q) => q.fieldName === 'uploadPlanningOfficerReport'
			);

			expect(uploadPlanningOfficerReport?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.planningOfficerReport = 'yes';
			expect(uploadPlanningOfficerReport?.shouldDisplay(journey.response)).toBe(true);

			journey.response.answers.planningOfficerReport = 'no';
			expect(uploadPlanningOfficerReport?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should show uploadInfrastructureLevy and infrastructureLevyAdopted only when infrastructureLevy is "yes"', () => {
			const section = journey.getSection('planning-officer-report');
			const uploadInfrastructureLevy = section?.questions.find(
				(q) => q.fieldName === 'uploadInfrastructureLevy'
			);
			const infrastructureLevyAdopted = section?.questions.find(
				(q) => q.fieldName === 'infrastructureLevyAdopted'
			);

			expect(uploadInfrastructureLevy?.shouldDisplay(journey.response)).toBe(false);
			expect(infrastructureLevyAdopted?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.infrastructureLevy = 'yes';
			expect(uploadInfrastructureLevy?.shouldDisplay(journey.response)).toBe(true);
			expect(infrastructureLevyAdopted?.shouldDisplay(journey.response)).toBe(true);

			journey.response.answers.infrastructureLevy = 'no';
			expect(uploadInfrastructureLevy?.shouldDisplay(journey.response)).toBe(false);
			expect(infrastructureLevyAdopted?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should show infrastructureLevyAdoptedDate only when infrastructureLevy is "yes" and infrastructureLevyAdopted is "yes"', () => {
			const section = journey.getSection('planning-officer-report');
			const infrastructureLevyAdoptedDate = section?.questions.find(
				(q) => q.fieldName === 'infrastructureLevyAdoptedDate'
			);

			expect(infrastructureLevyAdoptedDate?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.infrastructureLevy = 'yes';
			journey.response.answers.infrastructureLevyAdopted = 'yes';
			expect(infrastructureLevyAdoptedDate?.shouldDisplay(journey.response)).toBe(true);

			journey.response.answers.infrastructureLevyAdopted = 'no';
			expect(infrastructureLevyAdoptedDate?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.infrastructureLevy = 'no';
			journey.response.answers.infrastructureLevyAdopted = 'yes';
			expect(infrastructureLevyAdoptedDate?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.infrastructureLevyAdopted = 'no';
			expect(infrastructureLevyAdoptedDate?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should show infrastructureLevyExpectedDate only when infrastructureLevy is "yes" and infrastructureLevyAdopted is "no"', () => {
			const section = journey.getSection('planning-officer-report');
			const infrastructureLevyExpectedDate = section?.questions.find(
				(q) => q.fieldName === 'infrastructureLevyExpectedDate'
			);

			expect(infrastructureLevyExpectedDate?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.infrastructureLevy = 'yes';
			journey.response.answers.infrastructureLevyAdopted = 'yes';
			expect(infrastructureLevyExpectedDate?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.infrastructureLevyAdopted = 'no';
			expect(infrastructureLevyExpectedDate?.shouldDisplay(journey.response)).toBe(true);

			journey.response.answers.infrastructureLevy = 'no';
			journey.response.answers.infrastructureLevyAdopted = 'yes';
			expect(infrastructureLevyExpectedDate?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.infrastructureLevyAdopted = 'no';
			expect(infrastructureLevyExpectedDate?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should show otherRelevantMattersUpload only when otherRelevantMatters is "yes"', () => {
			const section = journey.getSection('planning-officer-report');
			const otherRelevantMattersUpload = section?.questions.find(
				(q) => q.fieldName === 'otherRelevantMattersUpload'
			);

			expect(otherRelevantMattersUpload?.shouldDisplay(journey.response)).toBe(false);

			journey.response.answers.otherRelevantMatters = 'yes';
			expect(otherRelevantMattersUpload?.shouldDisplay(journey.response)).toBe(true);

			journey.response.answers.otherRelevantMatters = 'no';
			expect(otherRelevantMattersUpload?.shouldDisplay(journey.response)).toBe(false);
		});
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
