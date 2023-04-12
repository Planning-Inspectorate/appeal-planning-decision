const {
	getCodeExpired
} = require('../../../../src/controllers/appeal-householder-decision/code-expired');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { CODE_EXPIRED, ENTER_CODE }
	}
} = require('../../../../src/lib/views');

const { mockRes, mockReq } = require('../../mocks');

describe('controllers/appeal-householder-decision/code-expired', () => {
	let req;
	let res;

	beforeEach(() => {
		res = mockRes();
		req = mockReq();
		req.session = {};
		jest.resetAllMocks();
	});

	describe('getCodeExpired', () => {
		it('should redirect to correct page', () => {
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';
			req.session = {
				userTokenId: tokenId
			};

			getCodeExpired(req, res);
			expect(res.render).toBeCalledWith(`${CODE_EXPIRED}`, { url: `/${ENTER_CODE}/${tokenId}` });
			expect(req.session.userTokenId).not.toBeDefined();
		});
	});
});
