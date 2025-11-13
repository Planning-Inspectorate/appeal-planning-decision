const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const {
	postContactPlanningInspectorate,
	getContactPlanningInspectorate
} = require('../../../../src/controllers/before-you-start/contact-planning-inspectorate');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { CONTACT_PLANNING_INSPECTORATE }
	}
} = require('../../../../src/lib/views');

const navigationPages = {
	contactPlanningInspectorateDate: '/before-you-start/contact-planning-inspectorate-date',
	cannotAppealPage: '/before-you-start/cannot-appeal'
};
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/before-you-start/contact-planning-inspectorate', () => {
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

	describe('getContactPlanningInspectorate', () => {
		it('should call the correct template', () => {
			req.session.appeal.eligibility.applicationDecision = 'granted';
			getContactPlanningInspectorate(req, res);

			expect(res.render).toHaveBeenCalledWith(CONTACT_PLANNING_INSPECTORATE, {
				appeal: req.session.appeal
			});
		});
	});

	describe('postContactPlanningInspectorate', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'contact-planning-inspectorate': 'bad value',
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};

			await postContactPlanningInspectorate(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(CONTACT_PLANNING_INSPECTORATE, {
				appeal: {
					...req.session.appeal,
					eligibility: {
						...req.session.appeal.eligibility,
						enforcementNotice: false,
						hasContactedPlanningInspectorate: null
					}
				},
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' },
				focusErrorSummary: true
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const mockRequest = {
				...req,
				body: {}
			};

			const error = new Error('Cheers');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postContactPlanningInspectorate(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(CONTACT_PLANNING_INSPECTORATE, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to `/before-you-start/cannot-appeal` if `contact-planning-inspectorate` is `no`', async () => {
			const mockRequest = {
				...req,
				body: {
					'contact-planning-inspectorate': 'no'
				}
			};

			await postContactPlanningInspectorate(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					hasContactedPlanningInspectorate: false
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.cannotAppealPage);
		});

		it('should redirect to `/before-you-start/contact-planning-inspectorate-date` if `contact-planning-inspectorate` is `yes`', async () => {
			const mockRequest = {
				...req,
				body: {
					'contact-planning-inspectorate': 'yes'
				}
			};

			await postContactPlanningInspectorate(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					hasContactedPlanningInspectorate: true
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.contactPlanningInspectorateDate);
		});
	});
});
