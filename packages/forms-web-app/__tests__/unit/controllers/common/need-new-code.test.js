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
		it('should redirect to correct page', async () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { NEED_NEW_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = { NEED_NEW_CODE };

			const returnedFunction = getNeedNewCode(views);
			await returnedFunction(req, res);

			expect(res.render).toHaveBeenCalledWith(`${NEED_NEW_CODE}`);
		});
	});

	describe('postRequestNewCode', () => {
		it(`should redirect to enter code page`, async () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { NEED_NEW_CODE, ENTER_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = { NEED_NEW_CODE, ENTER_CODE };
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';

			const returnedFunction = postNeedNewCode(views);
			req.params = {
				id: tokenId
			};
			await returnedFunction(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${ENTER_CODE}/${tokenId}`);
		});
	});
});
