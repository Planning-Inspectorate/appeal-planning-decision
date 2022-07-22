const {
	getRequestNewCode,
	postRequestNewCode
} = require('../../../../src/controllers/appeal-householder-decision/request-new-code');

const {
	VIEW: {
		APPELLANT_SUBMISSION: { REQUEST_NEW_CODE, ENTER_CODE }
	}
} = require('../../../../src/lib/views');

const { mockRes, mockReq } = require('../../mocks');

describe('controllers/appeal-householder-decision/enter-code', () => {
	let req;
	let res;

	beforeEach(() => {
		res = mockRes();
		req = mockReq();
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
			postRequestNewCode(req, res);
			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}`);
		});
	});
});
