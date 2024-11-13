const appeal = require('@pins/business-rules/test/data/householder-appeal');
const { isFeatureActive } = require('../../../../../src/featureFlag');
const { getDepartmentFromId } = require('../../../../../src/services/department.service');
const {
	getEnforcementNoticeHouseholder,
	postEnforcementNoticeHouseholder
} = require('../../../../../src/controllers/householder-planning/eligibility/enforcement-notice-householder');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { ENFORCEMENT_NOTICE_HOUSEHOLDER }
		}
	}
} = require('../../../../../src/lib/views');
const logger = require('../../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../../mocks');
const config = require('../../../../../src/config');

const navigationPages = {
	nextPage: '/before-you-start/claiming-costs-householder',
	v2NextPage: '/before-you-start/can-use-service',
	shutterPage: '/before-you-start/use-existing-service-enforcement-notice'
};

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/logger');
jest.mock('../../../../../src/featureFlag');
jest.mock('../../../../../src/services/department.service');

describe('controllers/householder-planning/eligibility/enforcement-notice-householder', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		appeal.eligibility.appealType = '1001';
		appeal.eligibility.applicationDecision = 'granted';
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getEnforcementNoticeHouseholder', () => {
		it('should call the correct template', () => {
			req.session.appeal.appealType = '1001';
			req.session.appeal.eligibility.applicationDecision = 'granted';

			getEnforcementNoticeHouseholder(req, res);

			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_NOTICE_HOUSEHOLDER, {
				bannerHtmlOverride: config.betaBannerText,
				enforcementNotice: appeal.eligibility.enforcementNotice,
				previousPage: navigationPages.previousPage
			});
		});
	});

	describe('postEnforcementNoticeHouseholder', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-notice': 'bad value',
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};

			const mockLpa = { lpaCode: 'Q9999', id: 'someId' };
			isFeatureActive.mockResolvedValue(false);
			getDepartmentFromId.mockResolvedValue(mockLpa);

			await postEnforcementNoticeHouseholder(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_NOTICE_HOUSEHOLDER, {
				bannerHtmlOverride: config.betaBannerText,
				enforcementNotice: appeal.eligibility.enforcementNotice,
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' }
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const mockRequest = {
				...req,
				body: {}
			};

			mockRequest.session.appeal.appealType = '1001';
			mockRequest.session.appeal.eligibility.applicationDecision = 'granted';
			const error = new Error('Cheers');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			const mockLpa = { lpaCode: 'Q9999', id: 'someId' };
			isFeatureActive.mockResolvedValue(false);
			getDepartmentFromId.mockResolvedValue(mockLpa);

			await postEnforcementNoticeHouseholder(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_NOTICE_HOUSEHOLDER, {
				bannerHtmlOverride: config.betaBannerText,
				enforcementNotice: appeal.eligibility.enforcementNotice,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to `/before-you-start/use-existing-service-enforcement-notice` if `enforcement-notice` is `yes`', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-notice': 'yes'
				}
			};

			const mockLpa = { lpaCode: 'Q9999', id: 'someId' };
			isFeatureActive.mockResolvedValue(false);
			getDepartmentFromId.mockResolvedValue(mockLpa);

			await postEnforcementNoticeHouseholder(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementNotice: true
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.shutterPage);
		});

		it('should redirect to `/before-you-start/claiming-costs-householder` if `enforcement-notice` is `no`', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-notice': 'no'
				}
			};
			const mockLpa = { lpaCode: 'Q9999', id: 'someId' };
			isFeatureActive.mockResolvedValue(false);
			getDepartmentFromId.mockResolvedValue(mockLpa);

			await postEnforcementNoticeHouseholder(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementNotice: false
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.nextPage);
		});

		it('should redirect to `/before-you-start/can-use-service` if `enforcement-notice` is `no` and v2 flag active', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-notice': 'no'
				}
			};
			const mockLpa = { lpaCode: 'Q9999', id: 'someId' };
			isFeatureActive.mockResolvedValue(true);
			getDepartmentFromId.mockResolvedValue(mockLpa);

			await postEnforcementNoticeHouseholder(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementNotice: false
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.v2NextPage);
		});
	});
});
