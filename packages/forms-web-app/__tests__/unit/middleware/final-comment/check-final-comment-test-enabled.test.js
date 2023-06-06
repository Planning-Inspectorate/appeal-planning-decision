const checkFinalCommentTestEnabled = require('../../../../src/middleware/final-comment/check-final-comment-test-enabled');
const { mockReq, mockRes } = require('../../mocks');
const config = require('../../../../src/config');
const { VIEW } = require('../../../../src/lib/views');

describe('checkFinalCommentTestEnabled', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		// mockReq by default sets an appeal field and places appeal object in session
		// so pass null and clear req.session to use for final comments
		req = {
			...mockReq(null),
			session: {}
		};
		res = mockRes();
		next = jest.fn();
		jest.resetAllMocks();
	});

	it('sets session and redirects to input code page with fake case reference when params is test and test config is true', () => {
		req.params.caseReference = 'test';
		config.server.allowTestingOverrides = true;

		checkFinalCommentTestEnabled(req, res, next);

		expect(req.session).not.toEqual({});
		expect(res.redirect).toHaveBeenCalledWith(
			`/${VIEW.FINAL_COMMENT.INPUT_CODE}/${req.session.finalComment.horizonId}`
		);
		expect(next).not.toHaveBeenCalled();
	});

	it('calls next when params is test and test config is false', () => {
		req.params.caseReference = 'test';
		config.server.allowTestingOverrides = false;

		checkFinalCommentTestEnabled(req, res, next);

		expect(req.session).toEqual({});
		expect(res.redirect).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it('calls next when params not test and test config is true', () => {
		req.params.caseReference = '987654321';
		config.server.allowTestingOverrides = true;

		checkFinalCommentTestEnabled(req, res, next);

		expect(req.session).toEqual({});
		expect(res.redirect).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});

	it('calls next when params not test and test config is false', () => {
		req.params.caseReference = '123456';
		config.server.allowTestingOverrides = false;

		checkFinalCommentTestEnabled(req, res, next);

		expect(req.session).toEqual({});
		expect(res.redirect).not.toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
	});
});
