const {
	getCodeExpired,
	postCodeExpired
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
		jest.resetAllMocks();
	});

	describe('getRequestNewCode', () => {
		it('should redirect to correct page', () => {
			getCodeExpired(req, res);
			expect(res.render).toBeCalledWith(`${CODE_EXPIRED}`);
		});
	});

	describe('postRequestNewCode', () => {
		it('should redirect to correct page', () => {
			postCodeExpired(req, res);
			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}`);
		});
	});
});
