const appeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getGrantedOrRefused,
	postGrantedOrRefused,
	forwardPage
} = require('../../../../src/controllers/full-appeal/granted-or-refused');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { GRANTED_OR_REFUSED, DECISION_DATE, DATE_DECISION_DUE }
	}
} = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/full-appeal/granted-or-refused', () => {
	let req;
	let res;
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl('S78'));

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getGrantedOrRefusedPlanningApplication', () => {
		it('should call the correct template', () => {
			getGrantedOrRefused(req, res);

			expect(res.render).toHaveBeenCalledWith(GRANTED_OR_REFUSED, {
				appeal: req.session.appeal,
				bannerHtmlOverride
			});
		});
	});

	describe('forwardPage', () => {
		it(`should return '/${DECISION_DATE}' if passed 'permissionStatus' is 'granted'`, async () => {
			const pageRedirect = forwardPage('granted');

			expect(pageRedirect).toEqual('/before-you-start/decision-date');
		});

		it(`should return '/${DECISION_DATE}' if passed 'permissionStatus' is 'refused'`, async () => {
			const pageRedirect = forwardPage('refused');

			expect(pageRedirect).toEqual('/before-you-start/decision-date');
		});

		it(`should return '/${DATE_DECISION_DUE}' if passed 'permissionStatus' is 'nodecisionreceived'`, async () => {
			const pageRedirect = forwardPage('nodecisionreceived');

			expect(pageRedirect).toEqual('/before-you-start/date-decision-due');
		});
		it(`should return '/${GRANTED_OR_REFUSED}' if passed 'permissionStatus' is 'default'`, async () => {
			const pageRedirect = forwardPage('default');

			expect(pageRedirect).toEqual(GRANTED_OR_REFUSED);
		});

		it(`should return '/${GRANTED_OR_REFUSED}' if 'permissionStatus' is not passed`, async () => {
			const pageRedirect = forwardPage();

			expect(pageRedirect).toEqual(GRANTED_OR_REFUSED);
		});
	});

	describe('postGrantedOrRefusedPlanning', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'granted-or-refused': null,
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postGrantedOrRefused(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(GRANTED_OR_REFUSED, {
				appeal: {
					...req.session.appeal,
					eligibility: {
						...req.session.appeal.eligibility,
						applicationDecision: null
					}
				},
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' },
				bannerHtmlOverride
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			const mockRequest = {
				...req,
				body: {}
			};

			const error = new Error('Api call error');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postGrantedOrRefused(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(GRANTED_OR_REFUSED, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }],
				bannerHtmlOverride
			});
		});

		it(`'should redirect to '/${DECISION_DATE}' if 'applicationDecision' is 'refused'`, async () => {
			const applicationDecision = 'refused';
			const mockRequest = {
				...req,
				body: {
					'granted-or-refused': applicationDecision
				}
			};
			await postGrantedOrRefused(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
		});

		it(`should redirect to '/${DECISION_DATE}' if 'applicationDecision' is 'granted'`, async () => {
			const applicationDecision = 'granted';
			const mockRequest = {
				...req,
				body: { 'granted-or-refused': applicationDecision }
			};
			await postGrantedOrRefused(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
		});

		it(`should redirect to '/${DATE_DECISION_DUE}' if 'applicationDecision' is 'nodecisionreceived'`, async () => {
			const applicationDecision = 'nodecisionreceived';
			const mockRequest = {
				...req,
				body: { 'granted-or-refused': applicationDecision }
			};
			await postGrantedOrRefused(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/date-decision-due');
		});
	});
});
