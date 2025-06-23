const checkAppealExists = require('../../../src/middleware/check-appeal-exists');

jest.mock('../../../src/config', () => ({
	logger: {
		level: 'info'
	}
}));

describe('middleware/check-appeal-exists', () => {
	let req;

	const res = {
		redirect: jest.fn()
	};
	const next = jest.fn();

	beforeEach(() => {
		req = {
			session: {
				appeal: {}
			},
			originalUrl: '/'
		};
	});

	it('should call next() if appealType is set', () => {
		req.session.appeal.appealType = '1005';
		checkAppealExists(req, res, next);
		expect(next).toHaveBeenCalled();
		expect(res.redirect).not.toHaveBeenCalled();
	});

	it('should redirect to the `/` page if the appealType is not set', () => {
		delete req.session.appeal.appealType;
		req.originalUrl = '/full-appeal/submit-appeal/task-list';
		checkAppealExists(req, res, next);
		expect(res.redirect).toHaveBeenCalledWith('/');
	});

	it('should redirect to the `/` page if req.session is not set', () => {
		delete req.session;
		req.originalUrl = '/full-appeal/submit-appeal/task-list';
		checkAppealExists(req, res, next);
		expect(res.redirect).toHaveBeenCalledWith('/');
	});

	it('should redirect to the `/` page if req.session.appeal is not set', () => {
		delete req.session.appeal;
		req.originalUrl = '/full-appeal/submit-appeal/task-list';
		checkAppealExists(req, res, next);
		expect(res.redirect).toHaveBeenCalledWith('/');
	});

	it('should redirect to the `/` page if req.session.appeal is null', () => {
		req.session.appeal = null;
		req.originalUrl = '/full-appeal/submit-appeal/task-list';
		checkAppealExists(req, res, next);
		expect(res.redirect).toHaveBeenCalledWith('/');
	});
});
