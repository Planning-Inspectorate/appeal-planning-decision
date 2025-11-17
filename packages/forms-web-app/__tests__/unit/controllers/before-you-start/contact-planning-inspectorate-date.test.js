const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const {
	postContactPlanningInspectorateDate,
	getContactPlanningInspectorateDate
} = require('../../../../src/controllers/before-you-start/contact-planning-inspectorate-date');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { CONTACT_PLANNING_INSPECTORATE_DATE }
	}
} = require('../../../../src/lib/views');

const navigationPages = {
	checkYourAnswersPage: '/before-you-start/check-your-answers',
	cannotAppealPage: '/before-you-start/cannot-appeal'
};
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/before-you-start/contact-planning-inspectorate-date', () => {
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

	describe('getContactPlanningInspectorateDate', () => {
		it('should call the correct template', () => {
			getContactPlanningInspectorateDate(req, res);

			expect(res.render).toHaveBeenCalledWith(CONTACT_PLANNING_INSPECTORATE_DATE, {
				contactPlanningInspectorateDate: null,
				hint: { contactPlanningInspectorateDate: expect.any(String) }
			});
		});
	});

	describe('postContactPlanningInspectorateDate', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'contact-planning-inspectorate-date': 'bad value',
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};

			await postContactPlanningInspectorateDate(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(CONTACT_PLANNING_INSPECTORATE_DATE, {
				contactPlanningInspectorateDate: {
					day: undefined,
					month: undefined,
					year: undefined
				},
				hint: {
					contactPlanningInspectorateDate: expect.any(String)
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
					'contact-planning-inspectorate-date-day': 12,
					'contact-planning-inspectorate-date-month': 12,
					'contact-planning-inspectorate-date-year': 2024
				}
			};

			const error = 'RangeError: Invalid time value';
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postContactPlanningInspectorateDate(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Invalid time value' })
			);

			expect(res.render).toHaveBeenCalledWith(CONTACT_PLANNING_INSPECTORATE_DATE, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it.each([
			['the same as', '2024-12-12'],
			['after', '2024-12-14']
		])(
			'should redirect to `before-you-start/cannot-appeal` if the contact date is %s the enforcement effective date',
			async (_, contactDate) => {
				const mockRequest = {
					...req,
					body: {
						'contact-planning-inspectorate-date': contactDate
					}
				};
				createOrUpdateAppeal.mockImplementation(() =>
					Promise.resolve({
						...mockRequest.session.appeal,
						eligibility: {
							...mockRequest.session.appeal.eligibility,
							enforcementEffectiveDate: new Date('2024-12-12').toISOString()
						}
					})
				);

				await postContactPlanningInspectorateDate(mockRequest, res);

				expect(createOrUpdateAppeal).toHaveBeenCalledWith({
					...appeal,
					eligibility: {
						...appeal.eligibility,
						contactPlanningInspectorateDate: expect.any(String)
					}
				});

				expect(res.redirect).toHaveBeenCalledWith(navigationPages.cannotAppealPage);
			}
		);

		it('should redirect to `/before-you-start/check-your-answers` if the issue date is valid', async () => {
			const mockRequest = {
				...req,
				body: {
					'contact-planning-inspectorate-date-day': 12,
					'contact-planning-inspectorate-date-month': 12,
					'contact-planning-inspectorate-date-year': 2024,
					'contact-planning-inspectorate-date': '2024-12-12'
				}
			};

			createOrUpdateAppeal.mockImplementation(() =>
				Promise.resolve({
					...mockRequest.session.appeal,
					eligibility: {
						...mockRequest.session.appeal.eligibility,
						enforcementEffectiveDate: new Date().toISOString()
					}
				})
			);

			await postContactPlanningInspectorateDate(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					contactPlanningInspectorateDate: expect.any(String)
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.checkYourAnswersPage);
		});
	});
});
