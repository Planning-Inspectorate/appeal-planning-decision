const {
	getEnterCodeR6,
	postEnterCodeR6
} = require('../../../../src/controllers/rule-6/enter-code');
const views = require('../../../../src/lib/views');
const rule6Views = views.VIEW.RULE_6;
const { mockReq, mockRes } = require('../../mocks');
const { getSessionEmail } = require('#lib/session-helper');
const { isTokenValid } = require('#lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const { isRule6UserByEmail } = require('../../../../src/services/user.service');

let { createOTPGrant } = require('@pins/common/src/client/auth-client');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/is-token-valid');
jest.mock('../../../../src/services/user.service');

jest.mock('@pins/common/src/utils', () => {
	return {
		testLPACode: 'Q9999',
		isTestLPA: jest.fn()
	};
});
jest.mock('../../../../src/services/user.service', () => {
	return {
		createRule6UserSession: (req, access_token, id_token, expiry, email) => {
			req.session.user = {
				access_token,
				id_token,
				expiry,
				email,
				isRule6User: true
			};
		},
		logoutUser: jest.fn(),
		isRule6UserByEmail: jest.fn()
	};
});
jest.mock('../../../../src/featureFlag');
jest.mock('../../../../src/lib/session-helper');
jest.mock('@pins/common/src/client/auth-client');
const TEST_EMAIL = 'test@example.com';
const TEST_ID = '89aa8504-773c-42be-bb68-029716ad9756';

describe('controllers/rule-6/enter-code', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		req = {
			...req,
			body: {},
			appealsApiClient: {
				linkUserToV2Appeal: jest.fn()
			}
		};
		delete req.session.appeal;
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('rule 6 enter code', () => {
		/**
		 * @param {boolean} [newCode]
		 */
		async function getConfirmEmailTest(newCode = undefined) {
			req = {
				...req,
				params: { enterCodeId: TEST_ID },
				session: { enterCode: { action: enterCodeConfig.actions.confirmEmail, newCode } }
			};
			isRule6UserByEmail.mockResolvedValue(true);
			const returnedFunction = getEnterCodeR6(rule6Views);

			await returnedFunction(req, res);

			expect(createOTPGrant).toHaveBeenCalledWith(TEST_EMAIL, enterCodeConfig.actions.confirmEmail);

			expect(res.render).toHaveBeenCalledWith(`${rule6Views.ENTER_CODE}`, {
				requestNewCodeLink: `/${rule6Views.REQUEST_NEW_CODE}`,
				confirmEmailLink: `/${rule6Views.EMAIL_ADDRESS}`,
				showNewCode: newCode
			});

			if (newCode) {
				expect(req.session.enterCode?.newCode).toBe(undefined);
			}
		}

		describe('getEnterCodeR6', () => {
			it('should handle general log in for rule 6 user', async () => {
				getSessionEmail.mockReturnValue(TEST_EMAIL);
				const returnedFunction = getEnterCodeR6(rule6Views);
				isRule6UserByEmail.mockResolvedValue(true);

				await returnedFunction(req, res);

				expect(createOTPGrant).toHaveBeenCalledWith(
					TEST_EMAIL,
					enterCodeConfig.actions.confirmEmail
				);

				expect(res.render).toHaveBeenCalledWith(`${rule6Views.ENTER_CODE}`, {
					confirmEmailLink: `/${rule6Views.EMAIL_ADDRESS}`,
					requestNewCodeLink: `/${rule6Views.REQUEST_NEW_CODE}`,
					showNewCode: undefined
				});
			});

			it('should not generate a token if not a rule 6 user', async () => {
				getSessionEmail.mockReturnValue(TEST_EMAIL);
				const returnedFunction = getEnterCodeR6(rule6Views);
				isRule6UserByEmail.mockResolvedValue(false);

				await returnedFunction(req, res);

				expect(createOTPGrant).not.toHaveBeenCalled();

				expect(res.render).toHaveBeenCalledWith(`${rule6Views.ENTER_CODE}`, {
					confirmEmailLink: `/${rule6Views.EMAIL_ADDRESS}`,
					requestNewCodeLink: `/${rule6Views.REQUEST_NEW_CODE}`,
					showNewCode: undefined
				});
			});

			it('should handle newCode confirm email', async () => {
				getSessionEmail.mockReturnValue(TEST_EMAIL);
				await getConfirmEmailTest(true);
			});
		});
	});

	describe('postEnterCodeR6', () => {
		beforeEach(() => {
			isTokenValid.mockReturnValue({
				valid: true,
				action: 'unused'
			});
			req.body = { 'email-code': '12312' };
		});

		it('should show validation errors to user', async () => {
			const errors = { 'mock-error': 'Error message' };
			const errorSummary = [{ text: 'There was an error', href: '#' }];

			req = {
				...req,
				body: {
					'email-code': '12345',
					errors,
					errorSummary
				},
				params: { enterCodeId: 'not-a-valid-id' }
			};

			const returnedFunction = postEnterCodeR6(rule6Views);
			await returnedFunction(req, res);

			expect(res.render).toHaveBeenCalledWith(`${rule6Views.ENTER_CODE}`, {
				token: req.body['email-code'],
				errors: errors,
				errorSummary: errorSummary,
				requestNewCodeLink: `/${rule6Views.REQUEST_NEW_CODE}`,
				confirmEmailLink: `/${rule6Views.EMAIL_ADDRESS}`
			});
			expect(isTokenValid).not.toHaveBeenCalled();
		});

		it('should render need new code page if too many attempts have been made', async () => {
			isTokenValid.mockReturnValue({
				tooManyAttempts: true
			});
			isRule6UserByEmail.mockResolvedValue(true);

			const returnedFunction = postEnterCodeR6(rule6Views);
			await returnedFunction(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${rule6Views.NEED_NEW_CODE}`);
		});

		it('should render code expired page when token is expired', async () => {
			isTokenValid.mockReturnValue({
				expired: true
			});
			isRule6UserByEmail.mockResolvedValue(true);

			const returnedFunction = postEnterCodeR6(rule6Views);
			await returnedFunction(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${rule6Views.CODE_EXPIRED}`);
		});

		it('should render page with error message if token invalid', async () => {
			isTokenValid.mockReturnValue({
				valid: false
			});
			isRule6UserByEmail.mockResolvedValue(true);

			const returnedFunction = postEnterCodeR6(rule6Views);
			await returnedFunction(req, res);

			const errorMessage = 'Enter the code we sent to your email address';

			expect(res.render).toHaveBeenCalledWith(`${rule6Views.ENTER_CODE}`, {
				token: req.body['email-code'],
				errors: {
					'email-code': { msg: errorMessage }
				},
				errorSummary: [{ text: errorMessage, href: '#email-code' }],
				requestNewCodeLink: `/${rule6Views.REQUEST_NEW_CODE}`,
				confirmEmailLink: `/${rule6Views.EMAIL_ADDRESS}`
			});
		});

		const expectUserInSession = () => {
			expect(req.session.user).toEqual({
				access_token: 'access',
				id_token: 'id',
				expiry: 'expiry',
				isRule6User: true,
				email: TEST_EMAIL
			});
		};

		it('should show an error if not a rule 6 user', async () => {
			isRule6UserByEmail.mockResolvedValue(false);

			const errors = { 'email-code': { msg: 'Enter the code we sent to your email address' } };
			const errorSummary = [
				{ text: 'Enter the code we sent to your email address', href: '#email-code' }
			];

			const returnedFunction = postEnterCodeR6(rule6Views);
			await returnedFunction(req, res);

			expect(res.render).toHaveBeenCalledWith(`${rule6Views.ENTER_CODE}`, {
				token: req.body['email-code'],
				errors: errors,
				errorSummary: errorSummary,
				requestNewCodeLink: `/${rule6Views.REQUEST_NEW_CODE}`,
				confirmEmailLink: `/${rule6Views.EMAIL_ADDRESS}`
			});
		});

		it('should redirect to rule 6 dashboard for successful log on', async () => {
			isTokenValid.mockResolvedValue({
				valid: true,
				access_token: 'access',
				id_token: 'id',
				access_token_expiry: 'expiry'
			});
			getSessionEmail.mockReturnValue(TEST_EMAIL);
			isRule6UserByEmail.mockResolvedValue(true);

			const returnedFunction = postEnterCodeR6(rule6Views);
			await returnedFunction(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${rule6Views.DASHBOARD}`);
			expectUserInSession();
		});

		it('should handle selected page request', async () => {
			isTokenValid.mockResolvedValue({
				valid: true,
				access_token: 'access',
				id_token: 'id',
				access_token_expiry: 'expiry'
			});
			getSessionEmail.mockReturnValue(TEST_EMAIL);
			isRule6UserByEmail.mockResolvedValue(true);

			req.session.loginRedirect = '/rule-6/1234567';
			req.session.navigationHistory = ['already-there'];

			const returnedFunction = postEnterCodeR6(rule6Views);
			await returnedFunction(req, res);

			expect(req.session.navigationHistory).toEqual(['already-there']); // unchanged
			expect(req.session.loginRedirect).toBeUndefined();
			expect(res.redirect).toHaveBeenCalledWith('/rule-6/1234567');
		});
	});
});
