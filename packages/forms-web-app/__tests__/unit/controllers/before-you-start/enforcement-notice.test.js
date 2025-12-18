const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const {
	postEnforcementNotice,
	getEnforcementNotice
} = require('../../../../src/controllers/before-you-start/enforcement-notice');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { ENFORCEMENT_NOTICE }
	}
} = require('../../../../src/lib/views');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

const navigationPages = {
	nextPage: '/before-you-start/application-number',
	enforcementPage: '/before-you-start/enforcement-notice-listed-building',
	shutterPage: '/before-you-start/use-existing-service-enforcement-notice'
};
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/lib/is-lpa-in-feature-flag');

describe('controllers/before-you-start/enforcement-notice', () => {
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

	describe('getEnforcementNotice', () => {
		it('should call the correct template', () => {
			req.session.appeal.eligibility.applicationDecision = 'granted';
			getEnforcementNotice(req, res);

			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_NOTICE, {
				appeal: req.session.appeal
			});
		});
	});

	describe('postEnforcementNotice', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-notice': 'bad value',
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			mockRequest.session.appeal.eligibility.applicationDecision = 'granted';

			isLpaInFeatureFlag.mockReturnValue(true);

			await postEnforcementNotice(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_NOTICE, {
				appeal: {
					...req.session.appeal,
					eligibility: {
						...req.session.appeal.eligibility,
						enforcementNotice: null
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

			mockRequest.session.appeal.appealType = '1005';
			mockRequest.session.appeal.eligibility.applicationDecision = 'granted';
			const error = new Error('Cheers');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
			isLpaInFeatureFlag.mockReturnValue(true);

			await postEnforcementNotice(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(ENFORCEMENT_NOTICE, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it('should redirect to `/before-you-start/use-existing-service-enforcement-notice` if `enforcement-notice` is `yes` and feature flag is off', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-notice': 'yes'
				}
			};
			isLpaInFeatureFlag.mockReturnValue(false);

			await postEnforcementNotice(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementNotice: true
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.shutterPage);
		});

		it('should redirect to `/before-you-start/enforcement-notice-listed-building` if `enforcement-notice` is `yes` and feature flag is on', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-notice': 'yes'
				}
			};
			isLpaInFeatureFlag.mockReturnValue(true);

			await postEnforcementNotice(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementNotice: true
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.enforcementPage);
		});

		it('should redirect to `/before-you-start/type-of-planning-application` if `enforcement-notice` is `no`', async () => {
			const mockRequest = {
				...req,
				body: {
					'enforcement-notice': 'no'
				}
			};
			isLpaInFeatureFlag.mockReturnValue(true);

			await postEnforcementNotice(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementNotice: false
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(navigationPages.nextPage);
		});
	});
});
