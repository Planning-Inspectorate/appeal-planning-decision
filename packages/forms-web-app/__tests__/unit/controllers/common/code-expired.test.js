const { getCodeExpired } = require('../../../../src/controllers/common/code-expired');
const { mockRes, mockReq } = require('../../mocks');

describe('controllers/common/code-expired', () => {
	let req;
	let res;

	beforeEach(() => {
		res = mockRes();
		req = mockReq();
		req.session = {};
		jest.resetAllMocks();
	});

	describe('getCodeExpired', () => {
		it('should redirect to correct page given full appeal views', () => {
			const {
				VIEW: {
					FULL_APPEAL: { CODE_EXPIRED, ENTER_CODE }
				}
			} = require('../../../../src/lib/views');

			const views = { CODE_EXPIRED, ENTER_CODE };
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';
			req.session = {
				userTokenId: tokenId
			};

			const returnedFunction = getCodeExpired(views);
			returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${CODE_EXPIRED}`, { url: `/${ENTER_CODE}/${tokenId}` });
			expect(req.session.userTokenId).not.toBeDefined();
		});

		it('should redirect to correct page given householder appeal views', () => {
			const {
				VIEW: {
					APPELLANT_SUBMISSION: { CODE_EXPIRED, ENTER_CODE }
				}
			} = require('../../../../src/lib/views');

			const views = { CODE_EXPIRED, ENTER_CODE };
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';
			req.session = {
				userTokenId: tokenId
			};

			const returnedFunction = getCodeExpired(views);
			returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${CODE_EXPIRED}`, { url: `/${ENTER_CODE}/${tokenId}` });
			expect(req.session.userTokenId).not.toBeDefined();
		});
	});
});
