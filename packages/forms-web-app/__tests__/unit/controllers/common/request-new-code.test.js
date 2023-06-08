const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../../../src/controllers/common/request-new-code');

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

	describe('getRequestNewCode', () => {
		it('should redirect to correct page', () => {
			const {
				VIEW: {
					FULL_APPEAL: { REQUEST_NEW_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = { REQUEST_NEW_CODE };

			const returnedFunction = getRequestNewCode(views);
			returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${REQUEST_NEW_CODE}`);
		});
	});

	describe('postRequestNewCode', () => {
		it('should redirect to correct page', () => {
			const {
				VIEW: {
					APPELLANT_SUBMISSION: { REQUEST_NEW_CODE, ENTER_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = { REQUEST_NEW_CODE, ENTER_CODE };
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';
			req.session = {
				userTokenId: tokenId
			};

			const returnedFunction = postRequestNewCode(views);
			returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${tokenId}`);
			expect(req.session.userTokenId).not.toBeDefined();
			expect(req.session.enterCode.newCode).toBe(true);
		});
	});
});
