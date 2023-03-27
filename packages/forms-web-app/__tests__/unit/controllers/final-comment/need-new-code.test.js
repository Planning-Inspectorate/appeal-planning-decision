const { getNeedNewCode } = require('../../../../src/controllers/final-comment/need-new-code');
const {
	VIEW: {
		FINAL_COMMENT: { NEED_NEW_CODE }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/final-comment/need-new-code', () => {
	let req;
	let res;
	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});
	describe('getNeedNewCode', () => {
		it('should render the need new code page with the getNewCodeHref from the session', async () => {
			req.session.getNewCodeHref = '/test-get-new-code-href';

			await getNeedNewCode(req, res);

			expect(res.render).toBeCalledWith(NEED_NEW_CODE, {
				getNewCodeHref: '/test-get-new-code-href'
			});
		});
	});
});
