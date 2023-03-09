const {
	skipMiddlewareIfFinalComments
} = require('../../../src/middleware/skip-middleware-if-final-comments');
const mockFunction = jest.fn();
const mockReq = {};
const mockRes = {};
const mockNext = jest.fn();

describe('middleware/skip-middleware-if-final-comments', () => {
	it('does not call function if path contains submit-final-comment', () => {
		mockReq.path = 'submit-final-comment/comments-question';
		const result = skipMiddlewareIfFinalComments(mockFunction);

		result(mockReq, mockRes, mockNext);

		expect(mockFunction).not.toHaveBeenCalled();
		expect(mockNext).toHaveBeenCalled();
	});

	it('does call function if path contains submit-final-comment', () => {
		mockReq.path = '/submit-appeal/email-address ';
		const result = skipMiddlewareIfFinalComments(mockFunction);

		result(mockReq, mockRes, mockNext);

		expect(mockFunction).toHaveBeenCalled();
		expect(mockNext).not.toHaveBeenCalled();
	});
});
