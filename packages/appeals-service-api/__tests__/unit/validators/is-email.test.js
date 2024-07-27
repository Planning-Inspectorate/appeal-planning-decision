const { mockReq, mockRes } = require('../mocks');
const { isEmail } = require('../../../src/validators/is-email');
const { validationResult } = require('express-validator');

const testMiddleware = async (req, res, middlewares) => {
	for (const middleware of middlewares) {
		await middleware(req, res, () => undefined);
	}
};

describe('validators/is-email.js', () => {
	it('should validate a valid email and call the next middleware', async () => {
		const req = mockReq();
		const res = mockRes();
		req.params.email = 'test@example.com';
		await testMiddleware(req, res, isEmail());
		const result = validationResult(req);
		expect(result.errors.length).toEqual(0);
	});
	it('should invalidate an invalid email, return http 400 and not call the next middleware', async () => {
		const req = mockReq();
		const res = mockRes();
		req.params.email = 'test';
		await testMiddleware(req, res, isEmail());
		const result = validationResult(req);
		expect(result.errors.length).toEqual(1);
	});
});
