const { storeAppealPageRedirect } = require('./login-redirect');

describe('storeAppealPageRedirect', () => {
	let req;

	beforeEach(() => {
		req = {
			originalUrl: '',
			session: {}
		};
	});

	it('sets loginRedirect', () => {
		req.originalUrl = '/appeals/your-appeals/decided-appeals';

		storeAppealPageRedirect('appeals', req);

		expect(req.session.loginRedirect).toBe('/appeals/your-appeals/decided-appeals');
	});

	it('does not set anything when path does not match basePath', () => {
		req.originalUrl = '/manage-appeals/1234567/appeal-details';

		storeAppealPageRedirect('appeals', req);

		expect(req.session.loginRedirect).toBeUndefined();
	});

	it('handles URLs with trailing slashes', () => {
		req.originalUrl = '/appeals/1234567/appeal-details/';

		storeAppealPageRedirect('appeals', req);

		expect(req.session.loginRedirect).toBe('/appeals/1234567/appeal-details/');
	});

	it('does not store loginRedirect if just base path like /appeals/ used', () => {
		req.originalUrl = '/appeals/';

		storeAppealPageRedirect('appeals', req);

		expect(req.session.loginRedirect).toBeUndefined();
	});
});
