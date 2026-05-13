const { constants } = require('@pins/business-rules');
const { subDays, addDays, startOfDay, getYear, getMonth, getDate } = require('date-fns');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const {
	calculateWithinDeadlineFromBeforeYouStart
} = require('@pins/business-rules/src/utils/calculate-is-within-deadline-before-you-start');
const {
	calculateDeadlineFromBeforeYouStart
} = require('@pins/business-rules/src/utils/calculate-deadline-before-you-start');
jest.mock('@pins/business-rules/src/utils/calculate-is-within-deadline-before-you-start');
jest.mock('@pins/business-rules/src/utils/calculate-deadline-before-you-start');

const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const decisionDateController = require('../../../../src/controllers/full-appeal/decision-date');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { DECISION_DATE }
	}
} = require('../../../../src/lib/views');

describe('controllers/full-appeal/decision-date', () => {
	let req;
	let res;

	const appeal = {
		...fullAppeal,
		appealType: constants.APPEAL_ID.PLANNING_SECTION_78
	};

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
		calculateWithinDeadlineFromBeforeYouStart.mockReturnValue(true);
		calculateDeadlineFromBeforeYouStart.mockReturnValue(new Date());
	});

	describe('getDecisionDate', () => {
		it('should call the correct template with no decision date given', () => {
			decisionDateController.getDecisionDate(req, res);

			expect(res.render).toHaveBeenCalledWith(DECISION_DATE, {
				decisionDate: null
			});
		});

		it('should call the correct template with a decision date given', () => {
			appeal.decisionDate = '2022-03-04T16:24:00.000Z';

			decisionDateController.getDecisionDate(req, res);

			expect(res.render).toHaveBeenCalledWith(DECISION_DATE, {
				decisionDate: {
					day: '04',
					month: '03',
					year: '2022'
				}
			});
		});
	});

	describe('postDecisionDate', () => {
		it('should save the appeal and redirect to correct page if date is within six months', async () => {
			const decisionDate = addDays(subDays(startOfDay(new Date()), 181), 1);
			const mockRequest = {
				...req,
				body: {
					'decision-date-year': getYear(decisionDate),
					'decision-date-month': getMonth(decisionDate) + 1,
					'decision-date-day': getDate(decisionDate)
				}
			};
			mockRequest.session.appeal.eligibility.applicationDecision =
				constants.APPLICATION_DECISION.REFUSED;

			await decisionDateController.postDecisionDate(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				decisionDate: decisionDate.toISOString()
			});

			expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/can-use-service`);
		});

		it('should not save the appeal and redirect to shutter page if date is not within six months', async () => {
			calculateWithinDeadlineFromBeforeYouStart.mockReturnValue(false);
			const mockRequest = {
				...req,
				body: {
					'decision-date-year': '2021',
					'decision-date-month': '01',
					'decision-date-day': '01'
				}
			};
			mockRequest.session.appeal.eligibility.applicationDecision =
				constants.APPLICATION_DECISION.REFUSED;

			global.Date.now = jest.fn(() => new Date('2021-10-01T00:00:00.000Z').getTime());

			await decisionDateController.postDecisionDate(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();
			expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/you-cannot-appeal`);
		});

		it('should display the decision date template with errors if any field is invalid', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: { 'decision-date-day': { msg: 'You need to provide a date' } }
				}
			};

			await decisionDateController.postDecisionDate(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(DECISION_DATE, {
				decisionDate: {
					day: undefined,
					month: undefined,
					year: undefined
				},
				errorSummary: [],
				errors: {
					'decision-date-day': {
						msg: 'You need to provide a date'
					}
				}
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const decisionDate = addDays(subDays(startOfDay(new Date()), 30), 1);
			const mockRequest = {
				...req,
				body: {
					'decision-date-year': getYear(decisionDate),
					'decision-date-month': getMonth(decisionDate) + 1,
					'decision-date-day': getDate(decisionDate)
				}
			};

			calculateWithinDeadlineFromBeforeYouStart.mockReturnValue(true);
			calculateDeadlineFromBeforeYouStart.mockReturnValue(new Date());

			const error = 'RangeError: Invalid time value';
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await decisionDateController.postDecisionDate(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(DECISION_DATE, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: 'decision-date' }]
			});
		});
	});
});
