const checkDebugAllowed = require('../../../src/middleware/check-debug-allowed');
const config = require('../../../src/config');
const { mockReq, mockRes } = require('../mocks');

describe('middleware/check-debug-allowed', () => {
	let req;
	const res = mockRes();
	const next = jest.fn();

	beforeEach(() => {
		req = {
			...mockReq
		};
	});

	it('should call next() when allowTestingOverrides is true', () => {
		config.server.allowTestingOverrides = true;

		checkDebugAllowed(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('should return 404 and render error/not-found when allowTestingOverrides is false', () => {
		config.server.allowTestingOverrides = false;

		checkDebugAllowed(req, res, next);

		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.render).toHaveBeenCalledWith('error/not-found');
	});
});
