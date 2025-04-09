const requireUser = require('../../../../src/middleware/lpa-dashboard/require-user');
const { storeAppealPageRedirect } = require('../../../../src/lib/login-redirect');
const { getUserFromSession } = require('../../../../src/services/user.service');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('#lib/views');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');
const isIdle = require('../../../../src/lib/check-session-idle');

jest.mock('../../../../src/lib/check-session-idle');
jest.mock('../../../../src/services/user.service');
jest.mock('../../../../src/lib/login-redirect', () => ({
	storeAppealPageRedirect: jest.fn(() => jest.fn())
}));

describe('requireUser', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		// mockReq by default sets an appeal field and places appeal object in session
		// so pass null and clear req.session to use for lpa user
		req = {
			...mockReq(null),
			session: {
				regenerate: (callback) => {
					callback();
				}
			},
			originalUrl: '/'
		};
		res = mockRes();
		next = jest.fn();
		jest.resetAllMocks();
		isIdle.mockReturnValue(false);
	});

	it('calls next if user is in session', () => {
		getUserFromSession.mockReturnValue({
			isLpaUser: true,
			expiry: new Date(Date.now() + 1000)
		});

		requireUser(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('redirects to login if no user', () => {
		requireUser(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
		expect(next).not.toHaveBeenCalled();
	});

	it('redirects to login if user status is removed', () => {
		const userEnabledStates = [STATUS_CONSTANTS.REMOVED];

		userEnabledStates.forEach((state) => {
			req.session.user = {
				lpaStatus: state,
				expiry: new Date(Date.now() + 1000)
			};

			requireUser(req, res, next);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
			expect(next).not.toHaveBeenCalled();
		});
	});

	it('redirects to login if user token expired', () => {
		req.session.user = {
			isLpaUser: true,
			expiry: new Date(Date.now() - 1000)
		};

		requireUser(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
		expect(next).not.toHaveBeenCalled();
	});

	it('redirects to login if user is idled', () => {
		req.session.user = {
			isLpaUser: true,
			expiry: new Date(Date.now() + 1000)
		};

		isIdle.mockReturnValue(true);

		requireUser(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
		expect(next).not.toHaveBeenCalled();
	});

	it('handles specific LPA page request redirect', () => {
		const redirectMiddleware = jest.fn((req) => {
			req.session.loginRedirect = req.originalUrl;
			req.session.tempBackLink = '/manage-appeals/1234567';
		});

		storeAppealPageRedirect.mockReturnValue(redirectMiddleware);

		getUserFromSession.mockReturnValue(null);

		req.originalUrl = '/manage-appeals/1234567/appeal-details';

		requireUser(req, res, next);

		expect(storeAppealPageRedirect).toHaveBeenCalledWith('manage-appeals');
		expect(redirectMiddleware).toHaveBeenCalledWith(req, res);
		expect(req.session.loginRedirect).toBe('/manage-appeals/1234567/appeal-details');
		expect(req.session.tempBackLink).toBe('/manage-appeals/1234567');
		expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
	});
});
