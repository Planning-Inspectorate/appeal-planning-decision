const {
	getRequestNewCode,
	postRequestNewCode,
	postRequestNewCodeLPA
} = require('../../../../src/controllers/common/request-new-code');
const { mockRes, mockReq } = require('../../mocks');
const { apiClient } = require('#lib/appeals-api-client');

jest.mock('#lib/appeals-api-client');

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
				enterCodeId: tokenId
			};

			const returnedFunction = postRequestNewCode(ENTER_CODE);
			returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${tokenId}`);
			expect(req.session.enterCodeId).not.toBeDefined();
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
				isLpaAdmin: true,
				enabled: true,
				lpaCode: 'Q9999'
			};
			apiClient.getUserByEmailV2.mockImplementation(() => Promise.resolve(user));

			req.body = {
				emailAddress: email_address
			};
			const returnedFunction = postRequestNewCodeLPA(views);
			await returnedFunction(req, res);
			expect(apiClient.getUserByEmailV2).toBeCalledWith(email_address);
			expect(res.render).not.toHaveBeenCalled();
			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${user.id}`);
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

			apiClient.getUserByEmailV2.mockImplementation(() => Promise.reject(new Error()));

			const returnedFunction = postRequestNewCodeLPA(views);
			await returnedFunction(req, res);
			expect(apiClient.getUserByEmailV2).toBeCalledWith(email_address);
			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(`${REQUEST_NEW_CODE}`, {
				errorSummary: customErrorSummary,
				errors: {}
			});
		});
	});
});
