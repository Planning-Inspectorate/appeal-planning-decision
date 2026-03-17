const { constants } = require('@pins/business-rules');
const { subDays, addDays, startOfDay, getYear, getMonth, getDate } = require('date-fns');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { APPLICATION_DATE }
	}
} = require('../../../../src/lib/views');
const {
	getApplicationDate,
	postApplicationDate
} = require('../../../../src/controllers/full-appeal/application-date');

describe('controllers/full-appeal/application-date', () => {
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
	});

	describe('getApplicationDate', () => {
		it('should call the correct template with no application date given', () => {
			getApplicationDate(req, res);

			expect(res.render).toHaveBeenCalledWith(APPLICATION_DATE, {
				applicationDate: null
			});
		});

		it('should call the correct template with a application date given', () => {
			appeal.applicationDate = '2022-03-04T16:24:00.000Z';

			getApplicationDate(req, res);

			expect(res.render).toHaveBeenCalledWith(APPLICATION_DATE, {
				applicationDate: {
					day: '04',
					month: '03',
					year: '2022'
				}
			});
		});
	});

	describe('postApplicationDate', () => {
		it('should save the appeal and redirect to correct page if date is within six months', async () => {
			const applicationDate = addDays(subDays(startOfDay(new Date()), 181), 1);
			const mockRequest = {
				...req,
				body: {
					'application-date-year': getYear(applicationDate),
					'application-date-month': getMonth(applicationDate) + 1,
					'application-date-day': getDate(applicationDate)
				}
			};

			await postApplicationDate(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				applicationDate: applicationDate.toISOString()
			});

			expect(res.redirect).toHaveBeenCalledWith(`/before-you-start/granted-or-refused`);
		});

		it('should display the application date template with errors if any field is invalid', async () => {
			const mockRequest = {
				...req,
				body: {
					errors: { 'application-date-day': { msg: 'You need to provide a date' } }
				}
			};

			await postApplicationDate(mockRequest, res);

			expect(res.render).toHaveBeenCalledWith(APPLICATION_DATE, {
				applicationDate: {
					day: undefined,
					month: undefined,
					year: undefined
				},
				errorSummary: [],
				errors: {
					'application-date-day': {
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

			const error = 'RangeError: Invalid time value';
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postApplicationDate(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(APPLICATION_DATE, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: 'application-date' }]
			});
		});
	});
});
