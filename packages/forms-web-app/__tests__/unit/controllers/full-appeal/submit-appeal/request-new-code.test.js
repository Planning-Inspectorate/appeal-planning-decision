const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../../../../src/controllers/full-appeal/submit-appeal/request-new-code');

const {
	VIEW: {
		FULL_APPEAL: { REQUEST_NEW_CODE, ENTER_CODE }
	}
} = require('../../../../../src/lib/views');

const { mockRes, mockReq } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/enter-code', () => {
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
			getRequestNewCode(req, res);
			expect(res.render).toBeCalledWith(`${REQUEST_NEW_CODE}`);
		});
	});

	describe('postRequestNewCode', () => {
		it('should redirect to correct page', () => {
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';
			req.session = {
				userTokenId: tokenId
			};
			postRequestNewCode(req, res);
			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${tokenId}`);
			expect(req.session.userTokenId).not.toBeDefined();
		});
	});
});
