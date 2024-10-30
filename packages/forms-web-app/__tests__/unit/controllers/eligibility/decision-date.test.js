const appeal = require('@pins/business-rules/test/data/householder-appeal');
const { subWeeks, addDays, subDays, endOfDay, format, parseISO } = require('date-fns');
const dateFilter = require('nunjucks-date-filter');
const { config, constants } = require('@pins/business-rules');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/config', () => ({
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

const decisionDateController = require('../../../../src/controllers/eligibility/decision-date');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');

describe('controllers/eligibility/decision-date', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getDecisionDate', () => {
		it('should call the correct template decision date unevaluated', () => {
			decisionDateController.getDecisionDate(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
				bannerHtmlOverride: 'some text',
				decisionDate: null
			});
		});
		it('should call the correct template with existing decision date', () => {
			const mockRequest = {
				...req
			};

			mockRequest.session.appeal.decisionDate = '2000-01-01T12:00:00.000Z';

			decisionDateController.getDecisionDate(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
				bannerHtmlOverride: 'some text',
				decisionDate: {
					day: '01',
					month: '01',
					year: 2000
				}
			});
		});
	});

	describe('postDecisionDate', () => {
		it('should display the decision date passed template if the decision date is passed', async () => {
			const mockRequest = {
				...req,
				body: {
					'decision-date': '2019-10-10'
				}
			};

			await decisionDateController.postDecisionDate(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				decisionDate: new Date('2019-10-10T12:00:00.000Z')
			});

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
		});

		it('should display the decision date template with errors if any field is invalid', async () => {
			const mockRequest = {
				...req,
				body: {
					...req.body,
					errors: {
						'decision-date-year': {
							msg: 'You need to provide a date'
						}
					}
				}
			};

			await decisionDateController.postDecisionDate(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
				bannerHtmlOverride: 'some text',
				decisionDate: {
					day: undefined,
					month: undefined,
					year: undefined
				},
				errorSummary: [],
				errors: {
					'decision-date-year': {
						msg: 'You need to provide a date'
					}
				}
			});

			mockRequest.body['decision-date-day'] = '01';
			mockRequest.body['decision-date-month'] = '01';

			await decisionDateController.postDecisionDate(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
				bannerHtmlOverride: 'some text',
				decisionDate: {
					day: '01',
					month: '01',
					year: undefined
				},
				errorSummary: [],
				errors: {
					'decision-date-year': {
						msg: 'You need to provide a date'
					}
				}
			});
		});

		it('should redirect to planning department as deadline date is not passed', async () => {
			const decisionDate = addDays(subWeeks(endOfDay(new Date()), 12), 1);

			const mockRequest = {
				...req,
				body: {
					'decision-date': format(decisionDate, 'yyyy-MM-dd'),
					errors: {},
					errorSummary: []
				}
			};

			await decisionDateController.postDecisionDate(mockRequest, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.PLANNING_DEPARTMENT}`);
		});

		it('should redirect to decision drop out as deadline date is passed', async () => {
			const decisionDate = subDays(subWeeks(endOfDay(new Date()), 12), 1);

			const mockRequest = {
				...req,
				body: {
					'decision-date': format(decisionDate, 'yyyy-MM-dd'),
					errors: {},
					errorSummary: []
				}
			};
			await decisionDateController.postDecisionDate(mockRequest, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.DECISION_DATE_PASSED}`);
		});
	});

	it('should re-render the template with errors if there is any validation error', async () => {
		const mockRequest = {
			...req,
			body: {
				'decision-date': '1-1-2020',
				'decision-date-day': '1',
				'decision-date-month': '1',
				'decision-date-year': '2020',
				errors: { a: 'b' },
				errorSummary: [{ text: 'There were errors here', href: '#' }]
			}
		};

		mockRequest.session.appeal.decisionDate = '2021-01-01';

		await decisionDateController.postDecisionDate(mockRequest, res);

		expect(res.redirect).not.toHaveBeenCalled();
		expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
			bannerHtmlOverride: 'some text',
			decisionDate: {
				day: '1',
				month: '1',
				year: '2020'
			},
			errorSummary: [{ text: 'There were errors here', href: '#' }],
			errors: { a: 'b' }
		});
	});

	it('should re-render the template with errors if there is any api call error', async () => {
		const mockRequest = {
			...req,
			body: {}
		};

		const error = new Error('Cheers');
		createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

		await decisionDateController.postDecisionDate(mockRequest, res);

		expect(logger.error).toHaveBeenCalledWith(error);

		expect(res.redirect).not.toHaveBeenCalled();

		expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE, {
			bannerHtmlOverride: 'some text',
			appeal: req.session.appeal,
			errors: {},
			errorSummary: [{ text: error.toString(), href: '#' }]
		});
	});

	describe('getDecisionDatePassed', () => {
		it('should call the correct template with deadline not valued', async () => {
			appeal.decisionDate = null;

			decisionDateController.getDecisionDatePassed(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE_PASSED, {
				bannerHtmlOverride: 'some text',
				deadlineDate: null
			});
		});
		it('should call the correct template with deadline date being 12 weeks after decision date', () => {
			appeal.decisionDate = '2020-10-10';

			const date = addDays(
				endOfDay(parseISO(appeal.decisionDate)),
				config.appeal.type[constants.APPEAL_ID.HOUSEHOLDER].appealDue.refused?.time
			);
			expect(dateFilter(date, 'DD MMMM YYYY')).toBe('02 January 2021');

			decisionDateController.getDecisionDatePassed(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.DECISION_DATE_PASSED, {
				bannerHtmlOverride: 'some text',
				deadlineDate: date
			});
		});
	});
});
