const {
	getNeedNewCode,
	postNeedNewCode
} = require('../../../../src/controllers/common/need-new-code');

const { mockRes, mockReq } = require('../../mocks');

describe('controllers/common/enter-code', () => {
	let req;
	let res;

	beforeEach(() => {
		res = mockRes();
		req = mockReq();
		req.session = {};
		jest.resetAllMocks();
	});

	describe('getNeedNewCode', () => {
		it('should redirect to correct page', () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { NEED_NEW_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = { NEED_NEW_CODE };

			const returnedFunction = getNeedNewCode(views);
			returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${NEED_NEW_CODE}`);
		});
	});

	describe('postRequestNewCode', () => {
		it('should redirect to correct page', () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { NEED_NEW_CODE, ENTER_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = { NEED_NEW_CODE, ENTER_CODE };
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';
			req.session = {
				userTokenId: tokenId
			};

			const returnedFunction = postNeedNewCode(views);
			returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${tokenId}`);
			expect(req.session.userTokenId).not.toBeDefined();
			expect(req.session.enterCode.newCode).toBe(true);
		});
	});
});
