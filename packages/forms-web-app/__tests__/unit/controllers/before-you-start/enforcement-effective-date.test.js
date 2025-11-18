const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const {
	postEnforcementEffectiveDate,
	getEnforcementEffectiveDate
} = require('../../../../src/controllers/before-you-start/enforcement-effective-date');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { ENFORCEMENT_EFFECTIVE_DATE }
	}
} = require('../../../../src/lib/views');

const navigationPages = {
	checkYouAnswersPage: '/before-you-start/can-use-service',
	contactPlanningInspectoratePage: '/before-you-start/contact-planning-inspectorate'
};
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/before-you-start/enforcement-effective-date', () => {
	let req;
	let res;

	const appeal = {
		...fullAppeal,
		appealType: '1005'
	};

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getEnforcementEffectiveDate', () => {
		it('should call the correct template', () => {
			getEnforcementEffectiveDate(req, res);

			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_EFFECTIVE_DATE, {
				enforcementEffectiveDate: null,
				hint: { enforcementEffectiveDate: expect.any(String) }
			});
		});
	});

	describe('postEnforcementEffectiveDate', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-effective-date': 'bad value',
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};

			await postEnforcementEffectiveDate(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_EFFECTIVE_DATE, {
				enforcementEffectiveDate: {
					day: undefined,
					month: undefined,
					year: undefined
				},
				hint: {
					enforcementEffectiveDate: expect.any(String)
				},
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' },
				focusErrorSummary: true
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-effective-date-day': 12,
					'enforcement-effective-date-month': 12,
					'enforcement-effective-date-year': 2024
				}
			};

			const error = 'RangeError: Invalid time value';
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postEnforcementEffectiveDate(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Invalid time value' })
			);

			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_EFFECTIVE_DATE, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to `/before-you-start/contact-planning-inspectorate` if the issue date is todays date', async () => {
			const todaysDate = new Date();

			const mockRequest = {
				...req,
				body: {
					'enforcement-effective-date-day': todaysDate.getDay(),
					'enforcement-effective-date-month': todaysDate.getMonth(),
					'enforcement-effective-date-year': todaysDate.getFullYear(),
					'enforcement-effective-date': todaysDate.toISOString().split('T')[0]
				}
			};

			await postEnforcementEffectiveDate(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementEffectiveDate: expect.any(String)
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.contactPlanningInspectoratePage);
		});

		it('should redirect to `/before-you-start/contact-planning-inspectorate` if the issue date is in the past', async () => {
			const historicDate = new Date('March 17, 2025 03:24:00');

			const mockRequest = {
				...req,
				body: {
					'enforcement-effective-date-day': historicDate.getDay(),
					'enforcement-effective-date-month': historicDate.getMonth(),
					'enforcement-effective-date-year': historicDate.getFullYear(),
					'enforcement-effective-date': historicDate.toISOString().split('T')[0]
				}
			};

			await postEnforcementEffectiveDate(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementEffectiveDate: expect.any(String)
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.contactPlanningInspectoratePage);
		});

		it('should redirect to `/before-you-start/check-your-answers` if the issue date is valid', async () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 45);

			const mockRequest = {
				...req,
				body: {
					'enforcement-effective-date-day': futureDate.getDate(),
					'enforcement-effective-date-month': futureDate.getMonth(),
					'enforcement-effective-date-year': futureDate.getFullYear(),
					'enforcement-effective-date': futureDate.toISOString().split('T')[0]
				}
			};

			await postEnforcementEffectiveDate(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementEffectiveDate: expect.any(String)
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.checkYouAnswersPage);
		});
	});
});
