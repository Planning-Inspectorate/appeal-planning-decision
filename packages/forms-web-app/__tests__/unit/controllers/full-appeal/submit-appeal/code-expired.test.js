const {
	getCodeExpired,
	postCodeExpired
} = require('../../../../../src/controllers/full-appeal/submit-appeal/code-expired');

const {
	VIEW: {
		FULL_APPEAL: { CODE_EXPIRED, ENTER_CODE }
	}
} = require('../../../../../src/lib/views');

const { mockRes, mockReq } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/code-expired', () => {
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
