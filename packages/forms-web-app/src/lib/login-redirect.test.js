const { storeAppealPageRedirect } = require('./login-redirect');

describe('storeAppealPageRedirect', () => {
	let req, res;

	beforeEach(() => {
		req = {
			originalUrl: '',
			session: {}
		};

		res = {};
	});

	it('sets loginRedirect and tempBackLink correctly for valid URL', () => {
		req.originalUrl = '/appeals/1234567/appeal-details';

		const redirect = storeAppealPageRedirect('appeals');

		redirect(req, res);

		expect(req.session.loginRedirect).toBe('/appeals/1234567/appeal-details');
		expect(req.session.tempBackLink).toBe('/appeals/1234567');
	});

	it('sets loginRedirect but not tempBackLink when missing 7-digit segment at 1st index', () => {
		req.originalUrl = '/appeals/your-appeals/decided-appeals';

		const redirect = storeAppealPageRedirect('appeals');

		redirect(req, res);

		expect(req.session.loginRedirect).toBe('/appeals/your-appeals/decided-appeals');
		expect(req.session.tempBackLink).toBeUndefined();
	});

	it('does not set anything when path does not match basePath', () => {
		req.originalUrl = '/manage-appeals/1234567/appeal-details';

		const redirect = storeAppealPageRedirect('appeals');

		redirect(req, res);

		expect(req.session.loginRedirect).toBeUndefined();
		expect(req.session.tempBackLink).toBeUndefined();
	});

	it('handles URLs with trailing slashes', () => {
		req.originalUrl = '/appeals/1234567/appeal-details/';

		const redirect = storeAppealPageRedirect('appeals');

		redirect(req, res);

		expect(req.session.loginRedirect).toBe('/appeals/1234567/appeal-details/');
		expect(req.session.tempBackLink).toBe('/appeals/1234567');
	});

	it('does not store loginRedirect or tempBackLink if just base path like /appeals/ used', () => {
		req.originalUrl = '/appeals/';

		const redirect = storeAppealPageRedirect('appeals');

		redirect(req, res);

		expect(req.session.loginRedirect).toBeUndefined();
		expect(req.session.tempBackLink).toBeUndefined();
	});
});
