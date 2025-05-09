const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { subMonths, addDays, subDays, endOfDay, format } = require('date-fns');
const { constants } = require('@pins/business-rules');

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
	}
}));

const dateDecisionDueController = require('../../../../src/controllers/full-appeal/date-decision-due');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { DATE_DECISION_DUE }
	}
} = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');

const navigationPage = {
	nextPage: '/before-you-start/can-use-service',
	shutterPage: '/before-you-start/you-cannot-appeal'
};

describe('controllers/full-appeal/date-decision-due', () => {
	let req;
	let res;

	const appeal = {
		...fullAppeal,
		appealType: constants.APPEAL_ID.PLANNING_SECTION_78
	};

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		createOrUpdateAppeal.mockResolvedValueOnce({ eligibility: {} });
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getDateDecisionDue', () => {
		it('should call the correct template date decision due unevaluated', () => {
			dateDecisionDueController.getDateDecisionDue(req, res);

			expect(res.render).toHaveBeenCalledWith(DATE_DECISION_DUE, {
				decisionDate: null
			});
		});

		it('should call the correct template with existing date decision due', () => {
			const mockRequest = {
				...req
			};

			mockRequest.session.appeal.decisionDate = '2000-01-01T12:00:00.000Z';

			dateDecisionDueController.getDateDecisionDue(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(DATE_DECISION_DUE, {
				decisionDate: {
					day: '01',
					month: '01',
					year: 2000
				}
			});
		});
	});

	describe('postDateDecisionDue', () => {
		it('should display the out of time shutter page template if the date decision due is passed the threshold', async () => {
			const mockRequest = {
				...req,
				body: {
					'decision-date': '2019-10-10'
				}
			};
			mockRequest.session.appeal.eligibility.applicationDecision =
				constants.APPLICATION_DECISION.REFUSED;

			await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				decisionDate: new Date('2019-10-10T12:00:00.000Z')
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPage.shutterPage);
		});

		it('should display the date decision due template with errors if any field is invalid', async () => {
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

			await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(DATE_DECISION_DUE, {
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

			await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(DATE_DECISION_DUE, {
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

		it('should display the date decision due template with errors if any field is invalid', async () => {
			let mockRequest = {
				...req,
				body: {
					'decision-date-day': '45',
					'decision-date-month': '15',
					'decision-date-year': '2021',
					errorSummary: [
						{
							text: 'The date the decision was due must be a real date',
							href: '#decision-date-day'
						},
						{
							text: 'The date the decision was due must be a real date',
							href: '#decision-date-month'
						}
					],
					errors: {
						'decision-date-day': {
							value: '45',
							msg: 'The date the decision was due must be a real date',
							param: 'decision-date-day',
							location: 'body'
						},
						'decision-date-month': {
							value: '15',
							msg: 'The date the decision was due must be a real date',
							param: 'decision-date-month',
							location: 'body'
						}
					}
				}
			};

			await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(DATE_DECISION_DUE, {
				decisionDate: {
					day: '45',
					month: '15',
					year: '2021'
				},
				errorSummary: [
					{
						text: 'The date the decision was due must be a real date',
						href: '#decision-date-day'
					}
				],
				errors: {
					'decision-date-day': {
						value: '45',
						msg: 'The date the decision was due must be a real date',
						param: 'decision-date-day',
						location: 'body'
					},
					'decision-date-month': {
						value: '15',
						msg: 'The date the decision was due must be a real date',
						param: 'decision-date-month',
						location: 'body'
					}
				}
			});

			mockRequest = {
				...req,
				body: {
					'decision-date-day': '45',
					'decision-date-month': '01',
					'decision-date-year': '2021',
					errorSummary: [
						{
							text: 'The date the decision was due must be a real date',
							href: '#decision-date-day'
						}
					],
					errors: {
						'decision-date-day': {
							value: '45',
							msg: 'The date the decision was due must be a real date',
							param: 'decision-date-day',
							location: 'body'
						}
					}
				}
			};

			await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(DATE_DECISION_DUE, {
				decisionDate: {
					day: '45',
					month: '01',
					year: '2021'
				},
				errorSummary: [
					{
						text: 'The date the decision was due must be a real date',
						href: '#decision-date-day'
					}
				],
				errors: {
					'decision-date-day': {
						value: '45',
						msg: 'The date the decision was due must be a real date',
						param: 'decision-date-day',
						location: 'body'
					}
				}
			});
		});

		it('should display the date decision due template with errors if any field is missing', async () => {
			const mockRequest = {
				...req,
				body: {
					'decision-date-day': 1,
					'decision-date-month': '',
					'decision-date-year': '',
					errorSummary: [
						{
							text: 'The date the decision was due must include a month and year',
							href: '#decision-date-month'
						},
						{
							text: 'The date the decision was due must include a year',
							href: '#decision-date-year'
						}
					],
					errors: {
						'decision-date-month': {
							value: '',
							msg: 'The date the decision was due must include a month and year',
							param: 'decision-date-month',
							location: 'body'
						},
						'decision-date-year': {
							value: '',
							msg: 'The date the decision was due must include a year',
							param: 'decision-date-year',
							location: 'body'
						}
					}
				}
			};
			await dateDecisionDueController.postDateDecisionDue(mockRequest, res);
			expect(res.render).toHaveBeenCalledWith(DATE_DECISION_DUE, {
				decisionDate: {
					day: 1,
					month: '',
					year: ''
				},
				errorSummary: [
					{
						text: 'The date the decision was due must include a month and year',
						href: '#decision-date-month'
					}
				],
				errors: {
					'decision-date-month': {
						value: '',
						msg: 'The date the decision was due must include a month and year',
						param: 'decision-date-month',
						location: 'body'
					},
					'decision-date-year': {
						value: '',
						msg: 'The date the decision was due must include a year',
						param: 'decision-date-year',
						location: 'body'
					}
				}
			});
		});

		it('should redirect to correct page if deadline date is not passed', async () => {
			const decisionDate = addDays(subMonths(endOfDay(new Date()), 5), 1);

			const mockRequest = {
				...req,
				body: {
					'decision-date': format(decisionDate, 'yyyy-MM-dd'),
					errors: {},
					errorSummary: []
				}
			};
			mockRequest.session.appeal.eligibility.applicationDecision =
				constants.APPLICATION_DECISION.REFUSED;

			await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

			expect(res.redirect).toHaveBeenCalledWith(navigationPage.nextPage);
		});

		it('should redirect to out of time as deadline date is passed', async () => {
			const decisionDate = subDays(subMonths(endOfDay(new Date()), 6), 1);
			createOrUpdateAppeal.mockResolvedValueOnce({
				decisionDate: new Date(`${decisionDate}T12:00:00.000Z`),
				eligibility: {}
			});

			const mockRequest = {
				...req,
				body: {
					'decision-date': format(decisionDate, 'yyyy-MM-dd'),
					errors: {},
					errorSummary: []
				}
			};
			mockRequest.session.appeal.eligibility.applicationDecision =
				constants.APPLICATION_DECISION.REFUSED;

			await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPage.shutterPage);
		});

		it('should re-render the date decision due template with errors if there is any api call error', async () => {
			const decisionDate = addDays(subMonths(endOfDay(new Date()), 6), 1);
			const error = new Error('Call to api failed');
			createOrUpdateAppeal.mockReset();
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			const mockRequest = {
				...req,
				body: {
					'decision-date': format(decisionDate, 'yyyy-MM-dd'),
					errors: {},
					errorSummary: []
				}
			};

			await dateDecisionDueController.postDateDecisionDue(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal
			});

			expect(res.redirect).not.toHaveBeenCalled();

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(DATE_DECISION_DUE, {
				decisionDate: {
					day: undefined,
					month: undefined,
					year: undefined
				},
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});
	});
});
