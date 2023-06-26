const {
	getRequestNewCode,
	postRequestNewCode,
	postRequestNewCodeLPA
} = require('../../../../src/controllers/common/request-new-code');
const { getUserByEmail } = require('../../../../src/lib/appeals-api-wrapper');
const { mockRes, mockReq } = require('../../mocks');
jest.mock('../../../../src/lib/appeals-api-wrapper');

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

			const returnedFunction = getRequestNewCode(REQUEST_NEW_CODE);
			returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${REQUEST_NEW_CODE}`);
		});
	});

	describe('getRequestNewCodeLPA', () => {
		it('should redirect to correct page', () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { REQUEST_NEW_CODE }
				}
			} = require('../../../../src/lib/views');

			const returnedFunction = getRequestNewCode(REQUEST_NEW_CODE);
			returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${REQUEST_NEW_CODE}`);
		});
	});
	describe('postRequestNewCode', () => {
		it('should redirect to correct page', () => {
			const {
				VIEW: {
					APPELLANT_SUBMISSION: { ENTER_CODE }
				}
			} = require('../../../../src/lib/views');
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';
			req.session = {
				userTokenId: tokenId
			};

			const returnedFunction = postRequestNewCode(ENTER_CODE);
			returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${tokenId}`);
			expect(req.session.userTokenId).not.toBeDefined();
			expect(req.session.enterCode.newCode).toBe(true);
		});
	});
	describe('postRequestNewCodeLPA', () => {
		it('should redirect to enter-code page if the email is correct', async () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { REQUEST_NEW_CODE, ENTER_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = {
				REQUEST_NEW_CODE,
				ENTER_CODE
			};
			const email_address = 'admin1@planninginspectorate.gov.uk';
			const user = {
				_id: '649954a21134d20012a8eb12',
				email: 'admin1@planninginspectorate.gov.uk',
				isAdmin: true,
				enabled: true,
				lpaCode: 'Q9999'
			};
			getUserByEmail.mockReturnValue(user);
			req.body = {
				emailAddress: email_address
			};
			const returnedFunction = postRequestNewCodeLPA(views);
			await returnedFunction(req, res);
			expect(getUserByEmail).toBeCalledWith(email_address);
			expect(res.render).not.toHaveBeenCalled();
			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${user._id}`);
		});
		it('should redirect to request-new-code page if the email is incorrect', async () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { REQUEST_NEW_CODE, ENTER_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = {
				REQUEST_NEW_CODE,
				ENTER_CODE
			};
			const email_address = 'admin1@planninginspectorate.gov.uk';
			const customErrorSummary = [{ text: 'Enter a correct email address', href: '#' }];

			req.body = {
				emailAddress: email_address
			};

			getUserByEmail.mockRejectedValue({
				type: 'Error',
				message: 'The user was not found'
			});

			const returnedFunction = postRequestNewCodeLPA(views);
			await returnedFunction(req, res);
			expect(getUserByEmail).toBeCalledWith(email_address);
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(`${REQUEST_NEW_CODE}`, {
				errorSummary: customErrorSummary,
				errors: {}
			});
		});
	});
});
