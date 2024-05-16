const requireUser = require('../../../../src/middleware/lpa-dashboard/require-user');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('#lib/views');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');
const isIdle = require('../../../../src/lib/check-session-idle');

jest.mock('../../../../src/lib/check-session-idle');

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
			}
		};
		res = mockRes();
		next = jest.fn();
		jest.resetAllMocks();
		isIdle.mockReturnValue(false);
	});

	it('calls next if user is in session', () => {
		req.session.user = {
			isLpaUser: true,
			expiry: new Date(Date.now() + 1000)
		};

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
});
