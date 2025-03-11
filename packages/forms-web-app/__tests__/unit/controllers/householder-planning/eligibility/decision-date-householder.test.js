const { subMonths, addDays, getYear, getMonth, getDate, startOfDay } = require('date-fns');
const sinon = require('sinon');
const {
	constants: { APPEAL_ID, APPLICATION_DECISION },
	rules,
	validation
} = require('@pins/business-rules');
const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');
const decisionDateHouseholderController = require('../../../../../src/controllers/householder-planning/eligibility/decision-date-householder');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { DECISION_DATE_HOUSEHOLDER }
		}
	}
} = require('../../../../../src/lib/views');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/logger');
jest.mock('../../../../../src/config', () => ({
	logger: {
		level: 'info'
	},
	server: {
		limitedRouting: {
			serviceUrl: 'example-url'
		}
	},
	betaBannerText: 'some text'
}));
jest.mock('../../../../../src/lib/is-lpa-in-feature-flag');

describe('controllers/householder-planning/eligibility/decision-date-householder', () => {
	let req;
	let res;

	const appeal = {
		...householderAppeal,
		appealType: APPEAL_ID.PLANNING_SECTION_78
	};

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getDecisionDateHouseholder', () => {
		it('should call the correct template with no decision date given', () => {
			decisionDateHouseholderController.getDecisionDateHouseholder(req, res);

			expect(res.render).toHaveBeenCalledWith(DECISION_DATE_HOUSEHOLDER, {
				bannerHtmlOverride: 'some text',
				decisionDate: null
			});
		});

		it('should call the correct template with a decision date given', () => {
			appeal.decisionDate = '2022-03-04T16:24:00.000Z';

			decisionDateHouseholderController.getDecisionDateHouseholder(req, res);

			expect(res.render).toHaveBeenCalledWith(DECISION_DATE_HOUSEHOLDER, {
				bannerHtmlOverride: 'some text',
				decisionDate: {
					day: '04',
					month: '03',
					year: '2022'
				}
			});
		});
	});

	describe('postDecisionDateHouseholder', () => {
		it.each([
			[false, 'claiming-costs-householder'],
			[true, 'can-use-service']
		])(
			'should save the appeal and redirect to correct page if application decision is granted and date is within six months - v2 is %p',
			async (isV2, page) => {
				isLpaInFeatureFlag.mockReturnValueOnce(isV2);
				const decisionDate = addDays(subMonths(startOfDay(new Date()), 1), 1);
				const mockRequest = {
					...req,
					body: {
						'decision-date-householder-year': getYear(decisionDate),
						'decision-date-householder-month': getMonth(decisionDate) + 1,
						'decision-date-householder-day': getDate(decisionDate)
					}
				};

				mockRequest.session.appeal.eligibility.applicationDecision = APPLICATION_DECISION.GRANTED;

				await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

				expect(createOrUpdateAppeal).toHaveBeenCalledWith({
					...appeal,
					decisionDate: decisionDate.toISOString()
				});

				expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/${page}`);
			}
		);

		it.each([
			[false, 'claiming-costs-householder'],
			[true, 'can-use-service']
		])(
			'should save the appeal and redirect to correct page if application decision is refused and date is within twelve weeks - v2 is %p',
			async (isV2, page) => {
				isLpaInFeatureFlag.mockReturnValueOnce(isV2);
				const decisionDate = addDays(subMonths(startOfDay(new Date()), 1), 1);
				const mockRequest = {
					...req,
					body: {
						'decision-date-householder-year': getYear(decisionDate),
						'decision-date-householder-month': getMonth(decisionDate) + 1,
						'decision-date-householder-day': getDate(decisionDate)
					}
				};

				appeal.eligibility.applicationDecision = 'refused';

				await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

				expect(createOrUpdateAppeal).toHaveBeenCalledWith({
					...appeal,
					decisionDate: decisionDate.toISOString()
				});

				expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/${page}`);
			}
		);

		it('should not save the appeal and redirect to you-cannot-appeal if application decision is granted and date is older than six months', async () => {
			const mockRequest = {
				...req,
				body: {
					'decision-date-householder-year': '2021',
					'decision-date-householder-month': '01',
					'decision-date-householder-day': '01'
				}
			};

			appeal.eligibility.applicationDecision = 'granted';
			global.Date.now = jest.fn(() => new Date('2021-08-01T00:00:00.000Z').getTime());

			await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalledWith();
			expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/you-cannot-appeal`);
		});

		it('should not save the appeal and redirect to you-cannot-appeal if application decision is refused and date is older than twelve weeks', async () => {
			const mockRequest = {
				...req,
				body: {
					'decision-date-householder-year': '2021',
					'decision-date-householder-month': '01',
					'decision-date-householder-day': '01'
				}
			};

			appeal.eligibility.applicationDecision = 'refused';
			global.Date.now = jest.fn(() => new Date('2021-05-01T00:00:00.000Z').getTime());

			await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalledWith();
			expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/you-cannot-appeal`);
		});

		it('should display the decision date template with errors if any field is invalid', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: { 'decision-date-householder-day': { msg: 'You need to provide a date' } }
				}
			};

			await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(DECISION_DATE_HOUSEHOLDER, {
				bannerHtmlOverride: 'some text',
				decisionDate: {
					day: undefined,
					month: undefined,
					year: undefined
				},
				errorSummary: [],
				errors: {
					'decision-date-householder-day': {
						msg: 'You need to provide a date'
					}
				}
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const mockRequest = {
				...req,
				body: {}
			};

			sinon.replace(rules.appeal, 'deadlineDate', () => new Date().toISOString());
			sinon.replace(rules.appeal, 'deadlinePeriod', () => ({ time: 1, period: 'weeks' }));
			sinon.replace(validation.appeal.decisionDate, 'isWithinDecisionDateExpiryPeriod', () => true);

			const error = 'RangeError: Invalid time value';
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await decisionDateHouseholderController.postDecisionDateHouseholder(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(DECISION_DATE_HOUSEHOLDER, {
				bannerHtmlOverride: 'some text',
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: 'decision-date-householder' }]
			});
		});
	});
});
