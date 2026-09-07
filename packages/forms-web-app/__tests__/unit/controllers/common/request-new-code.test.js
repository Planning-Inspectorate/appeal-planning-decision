const {
	getRequestNewCode,
	postRequestNewCode,
	postRequestNewCodeLPA
} = require('../../../../src/controllers/common/request-new-code');
const { mockRes, mockReq } = require('../../mocks');
jest.mock('#lib/logger');
jest.mock('@pins/common/src/client/auth-client');

describe('controllers/common/enter-code', () => {
	let req;
	let res;

	beforeEach(() => {
		res = mockRes();
		req = mockReq();
		req.session = {};
		req.appealsApiClient = {
			getUserByEmailV2: jest.fn()
		};
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

			expect(res.render).toHaveBeenCalledWith(`${REQUEST_NEW_CODE}`);
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

			expect(res.render).toHaveBeenCalledWith(`${REQUEST_NEW_CODE}`);
		});
	});

	describe('postRequestNewCode', () => {
		it('should redirect to correct page', async () => {
			const {
				VIEW: {
					APPELLANT_SUBMISSION: { ENTER_CODE }
				}
			} = require('#lib/views');
			req.session = {
				email: 'test@example.com',
				enterCode: {
					action: 'test-action'
				}
			};

			const returnedFunction = postRequestNewCode(ENTER_CODE);
			await returnedFunction(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${ENTER_CODE}`);
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
			req.session = {
				email: email_address,
				enterCode: {
					action: 'test-action'
				}
			};
			const user = {
				_id: '649954a21134d20012a8eb12',
				email: 'admin1@planninginspectorate.gov.uk',
				isLpaAdmin: true,
				enabled: true,
				lpaCode: 'Q9999'
			};
			req.appealsApiClient.getUserByEmailV2.mockImplementation(() => Promise.resolve(user));

			req.body = {
				emailAddress: email_address
			};
			const returnedFunction = postRequestNewCodeLPA(views.ENTER_CODE);
			await returnedFunction(req, res);
			expect(req.appealsApiClient.getUserByEmailV2).toHaveBeenCalledWith(email_address);
			expect(res.render).not.toHaveBeenCalled();
			expect(res.redirect).toHaveBeenCalledWith(`/${views.ENTER_CODE}`);
		});
	});
});
