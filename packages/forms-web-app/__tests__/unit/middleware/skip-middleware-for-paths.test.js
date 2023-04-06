const { skipMiddlewareForPaths } = require('../../../src/middleware/skip-middleware-for-paths');
const mockFunction = jest.fn();
const mockReq = {};
const mockRes = {};
const mockNext = jest.fn();

describe('middleware/skip-middleware-for-paths', () => {
	it('does not call function if path contains any of the paths to match', () => {
		mockReq.path = 'submit-final-comment/comments-question';
		const result = skipMiddlewareForPaths(mockFunction, [
			'submit-final-comment',
			'another-test-path'
		]);

		result(mockReq, mockRes, mockNext);

		expect(mockFunction).not.toHaveBeenCalled();
		expect(mockNext).toHaveBeenCalled();
	});

	it('calls function if path does not contain any of the paths to match', () => {
		mockReq.path = '/submit-appeal/email-address';
		const result = skipMiddlewareForPaths(mockFunction, [
			'submit-final-comment',
			'another-test-path'
		]);

		result(mockReq, mockRes, mockNext);

		expect(mockFunction).toHaveBeenCalled();
		expect(mockNext).not.toHaveBeenCalled();
	});
});
