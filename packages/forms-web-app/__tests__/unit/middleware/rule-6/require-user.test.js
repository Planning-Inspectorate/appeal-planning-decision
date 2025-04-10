const requireUser = require('../../../../src/middleware/rule-6/require-user');
const { getUserFromSession } = require('../../../../src/services/user.service');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('#lib/views');
const isIdle = require('../../../../src/lib/check-session-idle');

jest.mock('../../../../src/services/user.service');
jest.mock('../../../../src/lib/check-session-idle');

describe('requireUser (Rule 6)', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = {
			...mockReq(null),
			originalUrl: '/',
			session: {
				regenerate: (callback) => callback()
			}
		};
		res = mockRes();
		next = jest.fn();
		jest.resetAllMocks();
		isIdle.mockReturnValue(false);
	});

	it('calls next if Rule 6 user is in session and valid', () => {
		getUserFromSession.mockReturnValue({
			isRule6User: true,
			expiry: new Date(Date.now() + 1000)
		});

		requireUser(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('redirects to login if no user', () => {
		getUserFromSession.mockReturnValue(null);

		requireUser(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.RULE_6.EMAIL_ADDRESS}`);
		expect(next).not.toHaveBeenCalled();
	});
	it('redirects to login if token is expired', () => {
		getUserFromSession.mockReturnValue({
			isRule6User: true,
			expiry: new Date(Date.now() - 1000)
		});

		requireUser(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.RULE_6.EMAIL_ADDRESS}`);
		expect(next).not.toHaveBeenCalled();
	});

	it('redirects to login if user is idled', () => {
		getUserFromSession.mockReturnValue({
			isRule6User: true,
			expiry: new Date(Date.now() + 1000)
		});

		isIdle.mockReturnValue(true);

		requireUser(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.RULE_6.EMAIL_ADDRESS}`);
		expect(next).not.toHaveBeenCalled();
	});
	it('handles specific Rule 6 page request redirect', () => {
		getUserFromSession.mockReturnValue(null);

		req.originalUrl = '/rule-6/1234567/appeal-details';

		requireUser(req, res, next);

		expect(req.session.loginRedirect).toBe('/rule-6/1234567/appeal-details');
		expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.RULE_6.EMAIL_ADDRESS}`);
	});
});
