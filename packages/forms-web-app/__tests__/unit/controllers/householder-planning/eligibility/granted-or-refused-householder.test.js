const appeal = require('@pins/business-rules/test/data/householder-appeal');
const v8 = require('v8');
const {
	getGrantedOrRefusedHouseholder,
	postGrantedOrRefusedHouseholder
} = require('../../../../../src/controllers/householder-planning/eligibility/granted-or-refused-householder');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { GRANTED_OR_REFUSED_HOUSEHOLDER }
		}
	}
} = require('../../../../../src/lib/views');
const logger = require('../../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../../mocks');
const config = require('../../../../../src/config');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/logger');

describe('controllers/householder-planning/eligibility/granted-or-refused-householder', () => {
	let req;
	let res;
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('HAS'));

	beforeEach(() => {
		req = v8.deserialize(
			v8.serialize({
				...mockReq(appeal),
				body: {}
			})
		);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getGrantedOrRefusedHouseholder', () => {
		it('should call the correct template', () => {
			getGrantedOrRefusedHouseholder(req, res);

			expect(res.render).toHaveBeenCalledWith(GRANTED_OR_REFUSED_HOUSEHOLDER, {
				appeal: req.session.appeal,
				bannerHtmlOverride
			});
		});
	});

	describe('postGrantedOrRefusedHouseholder', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'granted-or-refused': null,
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postGrantedOrRefusedHouseholder(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(GRANTED_OR_REFUSED_HOUSEHOLDER, {
				appeal: req.session.appeal,
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' },
				bannerHtmlOverride
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const error = new Error('Api call error');
			const applicationDecision = 'granted';

			appeal.appealType = '1005';

			req.body = {
				'granted-or-refused': applicationDecision
			};

			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postGrantedOrRefusedHouseholder(req, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(GRANTED_OR_REFUSED_HOUSEHOLDER, {
				appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }],
				bannerHtmlOverride
			});
		});

		it(`'should redirect to '/before-you-start/decision-date-householder' if 'applicationDecision' is 'refused'`, async () => {
			const applicationDecision = 'refused';

			appeal.appealType = '1001';
			appeal.eligibility.applicationDecision = applicationDecision;
			req.body = {
				'granted-or-refused': applicationDecision
			};

			await postGrantedOrRefusedHouseholder(req, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date-householder');
		});

		it(`should redirect to '/before-you-start/decision-date-householder' if 'applicationDecision' is 'granted'`, async () => {
			const applicationDecision = 'granted';

			appeal.appealType = '1005';
			appeal.eligibility.applicationDecision = applicationDecision;
			req.body = {
				'granted-or-refused': applicationDecision
			};

			await postGrantedOrRefusedHouseholder(req, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
		});

		it(`should redirect to '/before-you-start/date-decision-due-householder' if 'applicationDecision' is 'nodecisionreceived'`, async () => {
			const applicationDecision = 'nodecisionreceived';

			appeal.eligibility.applicationDecision = applicationDecision;
			req.body = {
				'granted-or-refused': applicationDecision
			};

			await postGrantedOrRefusedHouseholder(req, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/date-decision-due');
		});
	});
});
