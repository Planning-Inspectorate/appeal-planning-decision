// checkLoggedIn.test.js

const { isFeatureActive } = require('../featureFlag');
const { mockRes } = require('../../__tests__/unit/mocks');

const { getUserFromSession } = require('../services/user.service');
const isIdle = require('../lib/check-session-idle');
const checkLoggedIn = require('./check-logged-in');
const { getExistingAppeal } = require('../lib/appeals-api-wrapper');

jest.mock('../featureFlag');
jest.mock('../services/user.service');
jest.mock('../lib/check-session-idle');
jest.mock('../lib/appeals-api-wrapper');

describe('checkLoggedIn middleware', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = {
			session: {
				regenerate: async (callback) => {
					callback();
				}
			},
			originalUrl: '/'
		};
		res = mockRes();
		next = jest.fn();
		jest.resetAllMocks();
		isIdle.mockReturnValue(false);
		isFeatureActive.mockResolvedValue(true);
	});

	it('should call next if user is authenticated', async () => {
		const mockUser = {
			expiry: new Date(Date.now() + 1000)
		};

		getUserFromSession.mockReturnValue(mockUser);

		await checkLoggedIn(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('should redirect if user is not authenticated', async () => {
		const mockUser = null;

		getUserFromSession.mockReturnValue(mockUser);

		await checkLoggedIn(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith('/appeal/email-address');
	});

	it('should redirect if user is expired', async () => {
		const mockUser = {
			expiry: new Date(Date.now() - 1000)
		};

		getUserFromSession.mockReturnValue(mockUser);

		await checkLoggedIn(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith('/appeal/email-address');
	});

	it('should redirect if user is idle', async () => {
		const mockUser = {
			expiry: new Date(Date.now() + 1000)
		};

		getUserFromSession.mockReturnValue(mockUser);
		isIdle.mockReturnValue(true);

		await checkLoggedIn(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith('/appeal/email-address');
	});

	it('handles document redirect', async () => {
		const mockUser = null;

		getUserFromSession.mockReturnValue(mockUser);
		getExistingAppeal.mockResolvedValue({
			id: 'a',
			appealType: 1001
		});
		req.originalUrl = '/document/a/b';
		req.params = {
			appealOrQuestionnaireId: 'a'
		};

		await checkLoggedIn(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith('/appeal-householder-decision/enter-code/a');
		expect(req.session.loginRedirect).toBe(req.originalUrl);
	});

	it('handles lpa questionnaire document redirect', async () => {
		const mockUser = null;

		getUserFromSession.mockReturnValue(mockUser);
		getExistingAppeal.mockResolvedValue({
			id: 'a',
			appealType: 1001
		});
		req.originalUrl = '/lpa-questionnaire-document/1010101';
		req.params = {
			caseReference: '1010101'
		};

		await checkLoggedIn(req, res, next);

		expect(res.redirect).toHaveBeenCalledWith('/manage-appeals/your-email-address');
		expect(req.session.loginRedirect).toBe(req.originalUrl);
	});

	it('handles specific page request redirect', async () => {
		const mockUser = null;
		getUserFromSession.mockReturnValue(mockUser);

		req.originalUrl = '/appeals/1234567/appeal-details';

		await checkLoggedIn(req, res, next);

		expect(req.session.loginRedirect).toBe('/appeals/1234567/appeal-details');
	});
});
