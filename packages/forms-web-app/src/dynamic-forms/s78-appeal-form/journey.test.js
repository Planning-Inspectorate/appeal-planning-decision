const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseS78SubmissionUrl, ...params } = require('./journey');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { APPLICATION_DECISION, TYPE_OF_PLANNING_APPLICATION } =
	require('@pins/business-rules').constants;

const mockResponse = {
	journeyId: 'S78',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('S78 Appeal Form Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});
	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseS78SubmissionUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual('/appeals/full-planning/appeal-form/your-appeal?id=123');
	});

	it('should set template', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTemplate).toBe('submission-form-template.njk');
	});
	it('should set journeyTitle', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTitle).toBe('Appeal a planning decision');
	});

	it('should display significant changes question when expedited criteria are met', () => {
		const eligibleResponse = {
			...mockResponse,
			journeyId: JOURNEY_TYPES.S78_APPEAL_FORM.id,
			expeditedAppealsEnabled: true,
			answers: {
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
				onApplicationDate: '2026-04-01T10:00:00.000Z',
				applicationDecision: APPLICATION_DECISION.GRANTED
			}
		};
		const journey = new Journey({ ...params, response: eligibleResponse });
		const anySignificantChangesQuestion = journey.sections
			.flatMap((section) => section.questions)
			.find((question) => question.fieldName === 'anySignificantChanges');

		expect(anySignificantChangesQuestion).toBeDefined();
		expect(anySignificantChangesQuestion.shouldDisplay(eligibleResponse)).toBe(true);
	});

	it('should hide significant changes question when expedited criteria are not met', () => {
		const ineligibleResponse = {
			...mockResponse,
			journeyId: JOURNEY_TYPES.S78_APPEAL_FORM.id,
			expeditedAppealsEnabled: false,
			answers: {
				typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL,
				onApplicationDate: '2026-04-01T10:00:00.000Z',
				applicationDecision: APPLICATION_DECISION.GRANTED
			}
		};
		const journey = new Journey({ ...params, response: ineligibleResponse });
		const anySignificantChangesQuestion = journey.sections
			.flatMap((section) => section.questions)
			.find((question) => question.fieldName === 'anySignificantChanges');

		expect(anySignificantChangesQuestion).toBeDefined();
		expect(anySignificantChangesQuestion.shouldDisplay(ineligibleResponse)).toBe(false);
	});
});
