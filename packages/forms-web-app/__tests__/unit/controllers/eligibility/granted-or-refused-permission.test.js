const appeal = require('@pins/business-rules/test/data/householder-appeal');
const {
	getNoDecision,
	getGrantedOrRefusedPermission,
	getGrantedOrRefusedPermissionOut,
	forwardPage,
	postGrantedOrRefusedPermission
} = require('../../../../src/controllers/eligibility/granted-or-refused-permission');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/eligibility/granted-or-refused-permission', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getNoDecision', () => {
		it('should call the correct template', () => {
			getNoDecision(req, res);
			expect(res.render).toHaveBeenCalledWith('eligibility/no-decision', {
				bannerHtmlOverride: config.betaBannerText
			});
		});
	});

	describe('getGrantedOrRefusedPlanningPermission', () => {
		it('should call the correct template', () => {
			getGrantedOrRefusedPermission(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
				bannerHtmlOverride: config.betaBannerText,
				appeal: req.session.appeal
			});
		});
	});

	describe('getGrantedOrRefusedPlanningPermissionOut', () => {
		it('should call the permission out template', () => {
			getGrantedOrRefusedPermissionOut(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT, {
				bannerHtmlOverride: config.betaBannerText
			});
		});
	});

	describe('forwardPage', () => {
		it(`should return '/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT}' if passed 'permissionStatus' is 'granted'`, async () => {
			const pageRedirect = forwardPage('granted');

			expect(pageRedirect).toEqual(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT);
		});

		it(`should return '/${VIEW.ELIGIBILITY.DECISION_DATE}' if passed 'permissionStatus' is 'refused'`, async () => {
			const pageRedirect = forwardPage('refused');

			expect(pageRedirect).toEqual(VIEW.ELIGIBILITY.DECISION_DATE);
		});

		it(`should return '/${VIEW.ELIGIBILITY.NO_DECISION}' if passed 'permissionStatus' is 'nodecisionreceived'`, async () => {
			const pageRedirect = forwardPage('nodecisionreceived');

			expect(pageRedirect).toEqual(VIEW.ELIGIBILITY.NO_DECISION);
		});

		it(`should return '/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION}' if passed 'permissionStatus' is 'default'`, async () => {
			const pageRedirect = forwardPage('default');

			expect(pageRedirect).toEqual(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION);
		});

		it(`should return '/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION}' if 'permissionStatus' is not passed`, async () => {
			const pageRedirect = forwardPage();

			expect(pageRedirect).toEqual(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION);
		});
	});

	describe('postGrantedOrRefusedPlanningPermission', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			const mockRequest = {
				...req,
				body: {
					'granted-or-refused-permission': null,
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postGrantedOrRefusedPermission(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
				bannerHtmlOverride: config.betaBannerText,
				appeal: {
					...req.session.appeal,
					eligibility: {
						...req.session.appeal.eligibility,
						planningPermissionStatus: null
					}
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

			const error = new Error('Api call error');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postGrantedOrRefusedPermission(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
				bannerHtmlOverride: config.betaBannerText,
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it(`'should redirect to '/${VIEW.ELIGIBILITY.DECISION_DATE}' if 'planningPermissionStatus' is 'refused'`, async () => {
			const planningPermissionStatus = 'refused';
			const mockRequest = {
				...req,
				body: {
					'granted-or-refused-permission': planningPermissionStatus
				}
			};
			await postGrantedOrRefusedPermission(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					planningPermissionStatus
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.DECISION_DATE}`);
		});

		it(`should redirect to '/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT}' if 'planningPermissionStatus' is 'granted'`, async () => {
			const planningPermissionStatus = 'granted';
			const mockRequest = {
				...req,
				body: { 'granted-or-refused-permission': planningPermissionStatus }
			};
			await postGrantedOrRefusedPermission(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					planningPermissionStatus
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(
				`/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT}`
			);
		});

		it(`should redirect to '/${VIEW.ELIGIBILITY.NO_DECISION}' if 'planningPermissionStatus' is 'nodecisionreceived'`, async () => {
			const planningPermissionStatus = 'nodecisionreceived';
			const mockRequest = {
				...req,
				body: { 'granted-or-refused-permission': planningPermissionStatus }
			};
			await postGrantedOrRefusedPermission(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith({
				...appeal,
				eligibility: {
					...appeal.eligibility,
					planningPermissionStatus
				}
			});

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.NO_DECISION}`);
		});
	});
});
