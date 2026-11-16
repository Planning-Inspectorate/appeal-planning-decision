const { validationErrorHandler } = require('./validation-error-handler');

describe('validationErrorHandler', () => {
	it('initializes the body when the request has no parsed body', () => {
		const req = {};
		const next = jest.fn();

		validationErrorHandler(req, {}, next);

		expect(req.body).toEqual({});
		expect(next).toHaveBeenCalledWith();
	});
});
