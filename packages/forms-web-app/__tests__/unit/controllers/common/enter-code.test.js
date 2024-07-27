const {
	getEnterCode,
	postEnterCode,
	getEnterCodeLPA,
	postEnterCodeLPA
} = require('../../../../src/controllers/common/enter-code');
const views = require('#lib/views');
const householderAppealViews = views.VIEW.APPELLANT_SUBMISSION;
const fullAppealViews = views.VIEW.FULL_APPEAL;
const lpaViews = views.VIEW.LPA_DASHBOARD;
const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { mockReq, mockRes } = require('../../mocks');
const { getSavedAppeal, getExistingAppeal, sendToken } = require('#lib/appeals-api-wrapper');
const { getSessionEmail, setSessionEmail } = require('#lib/session-helper');
const {
	getLPAUserStatus,
	setLPAUserStatus,
	getLPAUser
} = require('../../../../src/services/user.service');
const { isTokenValid } = require('#lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');
const { isFeatureActive } = require('../../../../src/featureFlag');
const { ApiClientError } = require('@pins/common/src/client/api-client-error');
let getAuthClient = require('@pins/common/src/client/auth-client');
const { AUTH } = require('@pins/common/src/constants');

jest.mock('#lib/appeals-api-wrapper');
jest.mock('#lib/is-token-valid');
jest.mock('@pins/common/src/utils', () => {
	return {
		testLPACode: 'Q9999',
		isTestLPA: jest.fn()
	};
});
jest.mock('../../../../src/services/user.service', () => {
	return {
		getLPAUserStatus: jest.fn(),
		createLPAUserSession: jest.fn(),
		createAppealUserSession: (req, access_token, id_token, expiry, email) => {
			req.session.user = {
				access_token: access_token,
				id_token: id_token,
				expiry: expiry,
				email
			};
		},
		setLPAUserStatus: jest.fn(),
		getLPAUser: jest.fn()
	};
});
jest.mock('../../../../src/featureFlag');
jest.mock('#lib/session-helper');
jest.mock('@pins/common/src/client/auth-client');
const TEST_EMAIL = 'test@example.com';
const TEST_ID = '89aa8504-773c-42be-bb68-029716ad9756';

let mockedGrant = jest.fn().mockResolvedValue();
/**
 * @param {boolean} [succeed]
 * @returns {void}
 */
const mockGrant = (succeed = true) => {
	mockedGrant = succeed
		? jest.fn().mockResolvedValue()
		: jest.fn().mockRejectedValue(new Error('auth error'));

	getAuthClient.mockResolvedValue({
		grant: mockedGrant
	});
};

describe('controllers/common/enter-code', () => {
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

	describe('getEnterCode', () => {
		/**
		 * @param {boolean} [newCode]
		 */
		async function getConfirmEmailTest(v2 = true, newCode = undefined) {
			req = {
				...req,
				params: { enterCodeId: TEST_ID },
				session: { enterCode: { action: enterCodeConfig.actions.confirmEmail, newCode } }
			};
			const returnedFunction = getEnterCode(householderAppealViews, { isGeneralLogin: false });
			mockGrant();

			await returnedFunction(req, res);

			if (v2) {
				expect(mockedGrant).toHaveBeenCalledWith({
					action: enterCodeConfig.actions.confirmEmail,
					email: TEST_EMAIL,
					grant_type: AUTH.GRANT_TYPE.OTP,
					resource: AUTH.RESOURCE
				});
			} else {
				expect(sendToken).toHaveBeenCalledWith(TEST_ID, enterCodeConfig.actions.confirmEmail);
			}

			expect(res.render).toHaveBeenCalledWith(`${householderAppealViews.ENTER_CODE}`, {
				requestNewCodeLink: `/${householderAppealViews.REQUEST_NEW_CODE}`,
				confirmEmailLink: `/${householderAppealViews.EMAIL_ADDRESS}`,
				showNewCode: newCode
			});

			if (newCode) {
				expect(req.session.enterCode?.newCode).toBe(undefined);
			}
		}

		/**
		 * @param {boolean} [newCode]
		 */
		async function getIsReturningFromEmailTest(v2 = true, newCode = undefined) {
			req = {
				...req,
				params: { enterCodeId: TEST_ID },
				session: { enterCode: { action: enterCodeConfig.actions.saveAndReturn, newCode } }
			};

			mockGrant();
			getExistingAppeal.mockResolvedValue(fullAppeal);

			const returnedFunction = getEnterCode(householderAppealViews, { isGeneralLogin: false });
			await returnedFunction(req, res);

			if (v2) {
				expect(mockedGrant).toHaveBeenCalledWith({
					action: enterCodeConfig.actions.saveAndReturn,
					email: fullAppeal.email,
					grant_type: AUTH.GRANT_TYPE.OTP,
					resource: AUTH.RESOURCE
				});
			} else {
				expect(sendToken).toHaveBeenCalledWith(TEST_ID, enterCodeConfig.actions.saveAndReturn);
			}

			expect(setSessionEmail).toHaveBeenCalledWith(req.session, fullAppeal.email, false);
			expect(res.render).toHaveBeenCalledWith(`${householderAppealViews.ENTER_CODE}`, {
				requestNewCodeLink: `/${householderAppealViews.REQUEST_NEW_CODE}`,
				confirmEmailLink: undefined,
				showNewCode: newCode
			});

			if (newCode) {
				expect(req.session.enterCode?.newCode).toBe(undefined);
			}
		}

		describe('flag off', () => {
			beforeEach(() => {
				isFeatureActive.mockResolvedValue(false);
			});

			it('should handle confirm email for appeal', async () => {
				await getConfirmEmailTest(false);
			});

			it('should handle newCode confirm email', async () => {
				await getConfirmEmailTest(false, true);
			});

			it('should handle save and return', async () => {
				await getIsReturningFromEmailTest(false);
			});

			it('should handle newCode save and return', async () => {
				await getIsReturningFromEmailTest(false, true);
			});
		});

		describe('flag on', () => {
			beforeEach(() => {
				isFeatureActive.mockResolvedValue(true);
			});

			it('should handle general log in', async () => {
				getSessionEmail.mockReturnValue(TEST_EMAIL);
				const returnedFunction = getEnterCode(householderAppealViews, { isGeneralLogin: true });
				mockGrant();

				await returnedFunction(req, res);

				expect(mockedGrant).toHaveBeenCalledWith({
					action: enterCodeConfig.actions.saveAndReturn,
					email: TEST_EMAIL,
					grant_type: AUTH.GRANT_TYPE.OTP,
					resource: AUTH.RESOURCE
				});

				expect(res.render).toHaveBeenCalledWith(`${householderAppealViews.ENTER_CODE}`, {
					confirmEmailLink: `/${householderAppealViews.EMAIL_ADDRESS}`,
					requestNewCodeLink: `/${householderAppealViews.REQUEST_NEW_CODE}`,
					showNewCode: undefined
				});
			});

			it('should handle confirm email for appeal', async () => {
				getSessionEmail.mockReturnValue(TEST_EMAIL);
				await getConfirmEmailTest(true);
			});

			it('should handle newCode confirm email', async () => {
				getSessionEmail.mockReturnValue(TEST_EMAIL);
				await getConfirmEmailTest(true, true);
			});

			it('should handle save and return', async () => {
				await getIsReturningFromEmailTest();
			});

			it('should handle newCode save and return', async () => {
				await getIsReturningFromEmailTest(true, true);
			});
		});
	});

	describe('postEnterCode', () => {
		beforeEach(() => {
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue({
				valid: true,
				action: 'unused'
			});
			req.body = { 'email-code': '12312' };
		});

		it('should show validation errors to user', async () => {
			const { ENTER_CODE } = fullAppealViews;

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

			const returnedFunction = postEnterCode({ ENTER_CODE }, { isGeneralLogin: false });
			await returnedFunction(req, res);

			expect(res.render).toHaveBeenCalledWith(`${ENTER_CODE}`, {
				token: req.body['email-code'],
				errors: errors,
				errorSummary: errorSummary
			});
			expect(isTokenValid).not.toHaveBeenCalled();
			expect(getSavedAppeal).not.toHaveBeenCalled();
			expect(getExistingAppeal).not.toHaveBeenCalled();
		});

		it('should render need new code page if too many attempts have been made', async () => {
			const { NEED_NEW_CODE } = fullAppealViews;

			getExistingAppeal.mockReturnValue({
				fullAppeal
			});

			isTokenValid.mockReturnValue({
				tooManyAttempts: true
			});

			const returnedFunction = postEnterCode({ NEED_NEW_CODE }, { isGeneralLogin: false });
			await returnedFunction(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${NEED_NEW_CODE}`);
			expect(req.session.appeal).not.toEqual(fullAppeal);
		});

		it('should render code expired page when token is expired', async () => {
			const { CODE_EXPIRED } = fullAppealViews;

			getExistingAppeal.mockReturnValue({
				fullAppeal
			});
			isTokenValid.mockReturnValue({
				expired: true
			});

			const returnedFunction = postEnterCode({ CODE_EXPIRED }, { isGeneralLogin: true });
			await returnedFunction(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${CODE_EXPIRED}`);
			expect(req.session.appeal).not.toEqual(fullAppeal);
		});

		it('should render page with error message if token invalid', async () => {
			const { ENTER_CODE } = fullAppealViews;

			isTokenValid.mockReturnValue({
				valid: false
			});

			const returnedFunction = postEnterCode({ ENTER_CODE }, { isGeneralLogin: true });
			await returnedFunction(req, res);

			const errorMessage = 'Enter the correct code';

			expect(res.render).toHaveBeenCalledWith(`${ENTER_CODE}`, {
				token: req.body['email-code'],
				errors: {
					'email-code': { msg: errorMessage }
				},
				errorSummary: [{ text: errorMessage, href: '#email-code' }]
			});
		});

		describe('POST flag off', () => {
			beforeEach(() => {
				isFeatureActive.mockResolvedValue(false);
			});

			it('should not allow general log on', async () => {
				const { EMAIL_CONFIRMED } = fullAppealViews;

				const returnedFunction = postEnterCode({ EMAIL_CONFIRMED }, { isGeneralLogin: true });

				await expect(returnedFunction(req, res)).rejects.toThrow(
					new Error('unhandled journey for POST: enter-code')
				);
			});

			it('should redirect to email confirmed page if email action', async () => {
				const { EMAIL_CONFIRMED } = fullAppealViews;
				req.session.enterCode = {
					action: enterCodeConfig.actions.confirmEmail
				};

				const returnedFunction = postEnterCode({ EMAIL_CONFIRMED }, { isGeneralLogin: false });
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith(`/${EMAIL_CONFIRMED}`);
			});

			it('should redirect to custom url if email action', async () => {
				const { EMAIL_CONFIRMED } = fullAppealViews;
				req.session.enterCode = {
					action: enterCodeConfig.actions.confirmEmail
				};

				req.session.loginRedirect = '/test';

				const returnedFunction = postEnterCode({ EMAIL_CONFIRMED }, { isGeneralLogin: false });
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith('/test');
				expect(req.appealsApiClient.linkUserToV2Appeal).not.toHaveBeenCalled();
			});

			it(`should show user error if returning from email and can't find appeal`, async () => {
				const { ENTER_CODE } = fullAppealViews;
				req.session.enterCode = {
					action: enterCodeConfig.actions.saveAndReturn
				};

				const error = new ApiClientError('no appeal', 404);
				getExistingAppeal.mockImplementation(() => Promise.reject(error));

				const returnedFunction = postEnterCode({ ENTER_CODE }, { isGeneralLogin: false });
				await returnedFunction(req, res);

				const errorMessage = 'We did not find your appeal. Enter the correct code';

				expect(res.render).toHaveBeenCalledWith(`${ENTER_CODE}`, {
					token: req.body['email-code'],
					errors: {
						'email-code': { msg: errorMessage }
					},
					errorSummary: [{ href: '#email-code', text: errorMessage }]
				});
			});

			it(`should redirect to custom url if for email return`, async () => {
				req.session.enterCode = {
					action: enterCodeConfig.actions.saveAndReturn
				};
				req.session.loginRedirect = '/test';

				const appealLookup = { state: 'DRAFT' };

				getExistingAppeal.mockImplementation(() => Promise.resolve(appealLookup));

				const returnedFunction = postEnterCode({}, { isGeneralLogin: false });
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith('/test');
				expect(req.session.appeal).toEqual(appealLookup);
			});

			it(`should redirect to appeal submitted for email return if submitted`, async () => {
				const { APPEAL_ALREADY_SUBMITTED } = fullAppealViews;
				req.session.enterCode = {
					action: enterCodeConfig.actions.saveAndReturn
				};

				const appealLookup = { state: 'SUBMITTED' };

				getExistingAppeal.mockImplementation(() => Promise.resolve(appealLookup));

				const returnedFunction = postEnterCode(
					{ APPEAL_ALREADY_SUBMITTED },
					{ isGeneralLogin: false }
				);
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith(`/${APPEAL_ALREADY_SUBMITTED}`);
				expect(req.session.appeal).toEqual(appealLookup);
			});

			it(`should redirect to TASK_LIST for email return`, async () => {
				const { TASK_LIST } = fullAppealViews;
				req.session.enterCode = {
					action: enterCodeConfig.actions.saveAndReturn
				};

				const appealLookup = { state: 'DRAFT' };

				getExistingAppeal.mockImplementation(() => Promise.resolve(appealLookup));

				const returnedFunction = postEnterCode({ TASK_LIST }, { isGeneralLogin: false });
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
				expect(req.session.appeal).toEqual(appealLookup);
			});
		});

		describe('POST flag on', () => {
			beforeEach(() => {
				isFeatureActive.mockResolvedValue(true);
			});

			const expectUserInSession = () => {
				expect(req.session.user).toEqual({
					access_token: 'access',
					id_token: 'id',
					expiry: 'expiry'
				});
			};

			it('should redirect to your appeals for general log on', async () => {
				const { YOUR_APPEALS } = fullAppealViews;

				isTokenValid.mockResolvedValue({
					valid: true,
					access_token: 'access',
					id_token: 'id',
					access_token_expiry: 'expiry'
				});

				const returnedFunction = postEnterCode({ YOUR_APPEALS }, { isGeneralLogin: true });
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith(`/${YOUR_APPEALS}`);
				expectUserInSession();
			});

			it('should redirect to confirmed page if email action', async () => {
				const { EMAIL_CONFIRMED } = fullAppealViews;
				req.session.enterCode = {
					action: enterCodeConfig.actions.confirmEmail
				};

				isTokenValid.mockResolvedValue({
					valid: true,
					access_token: 'access',
					id_token: 'id',
					access_token_expiry: 'expiry'
				});

				const returnedFunction = postEnterCode({ EMAIL_CONFIRMED }, { isGeneralLogin: false });
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith(`/${EMAIL_CONFIRMED}`);
				expectUserInSession();
			});

			it('should redirect to custom url if email action', async () => {
				const { EMAIL_CONFIRMED } = fullAppealViews;
				req.session.enterCode = {
					action: enterCodeConfig.actions.confirmEmail
				};

				isTokenValid.mockResolvedValue({
					valid: true,
					access_token: 'access',
					id_token: 'id',
					access_token_expiry: 'expiry'
				});

				req.session.loginRedirect = '/test';

				const returnedFunction = postEnterCode({ EMAIL_CONFIRMED }, { isGeneralLogin: false });
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith('/test');
				expect(req.appealsApiClient.linkUserToV2Appeal).toHaveBeenCalled();
			});

			it(`should show user error if returning from email and can't find appeal`, async () => {
				const { ENTER_CODE } = fullAppealViews;
				req.session.enterCode = {
					action: enterCodeConfig.actions.saveAndReturn
				};

				const error = new ApiClientError('no appeal', 404);
				getExistingAppeal.mockImplementation(() => Promise.reject(error));

				const returnedFunction = postEnterCode({ ENTER_CODE }, { isGeneralLogin: false });
				await returnedFunction(req, res);

				const errorMessage = 'We did not find your appeal. Enter the correct code';
				expect(res.render).toHaveBeenCalledWith(`${ENTER_CODE}`, {
					token: req.body['email-code'],
					errors: {
						'email-code': { msg: errorMessage }
					},
					errorSummary: [{ href: '#email-code', text: errorMessage }]
				});
			});

			it(`should redirect to custom url if for email return`, async () => {
				req.session.enterCode = {
					action: enterCodeConfig.actions.saveAndReturn
				};
				req.session.loginRedirect = '/test';

				const appealLookup = { state: 'DRAFT' };

				getExistingAppeal.mockImplementation(() => Promise.resolve(appealLookup));

				const returnedFunction = postEnterCode({}, { isGeneralLogin: false });
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith('/test');
				expect(req.session.appeal).toEqual(appealLookup);
			});

			it(`should redirect to appeal submitted for email return if submitted`, async () => {
				const { APPEAL_ALREADY_SUBMITTED } = fullAppealViews;
				req.session.enterCode = {
					action: enterCodeConfig.actions.saveAndReturn
				};

				const appealLookup = { state: 'SUBMITTED' };

				getExistingAppeal.mockImplementation(() => Promise.resolve(appealLookup));

				const returnedFunction = postEnterCode(
					{ APPEAL_ALREADY_SUBMITTED },
					{ isGeneralLogin: false }
				);
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith(`/${APPEAL_ALREADY_SUBMITTED}`);
				expect(req.session.appeal).toEqual(appealLookup);
			});

			it(`should redirect to TASK_LIST for email return`, async () => {
				const { TASK_LIST } = fullAppealViews;
				req.session.enterCode = {
					action: enterCodeConfig.actions.saveAndReturn
				};

				const appealLookup = { state: 'DRAFT' };

				getExistingAppeal.mockImplementation(() => Promise.resolve(appealLookup));

				const returnedFunction = postEnterCode({ TASK_LIST }, { isGeneralLogin: false });
				await returnedFunction(req, res);

				expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
				expect(req.session.appeal).toEqual(appealLookup);
			});
		});
	});

	describe('getEnterCodeLPA', () => {
		it('should render page', async () => {
			const userId = '649418158b915f0018524cb7';
			const expectedURL = 'manage-appeals/enter-code';
			const expectedContext = {
				lpaUserId: userId,
				requestNewCodeLink: '/manage-appeals/request-new-code'
			};
			const { ENTER_CODE, CODE_EXPIRED, NEED_NEW_CODE, REQUEST_NEW_CODE, DASHBOARD } = lpaViews;
			const views = {
				ENTER_CODE,
				CODE_EXPIRED,
				NEED_NEW_CODE,
				REQUEST_NEW_CODE,
				DASHBOARD
			};
			const returnedFunction = getEnterCodeLPA(views);
			req.params.id = userId;
			await returnedFunction(req, res);
			expect(res.render).toHaveBeenCalledWith(expectedURL, expectedContext);
		});
		it('should redirect if user id is not supplied', async () => {
			const {
				ENTER_CODE,
				CODE_EXPIRED,
				NEED_NEW_CODE,
				REQUEST_NEW_CODE,
				DASHBOARD,
				YOUR_EMAIL_ADDRESS
			} = lpaViews;
			const views = {
				ENTER_CODE,
				CODE_EXPIRED,
				NEED_NEW_CODE,
				REQUEST_NEW_CODE,
				DASHBOARD,
				YOUR_EMAIL_ADDRESS
			};
			const expectedURL = `/${views.YOUR_EMAIL_ADDRESS}`;
			const returnedFunction = getEnterCodeLPA(views);
			await returnedFunction(req, res);
			expect(res.redirect).toHaveBeenCalledWith(expectedURL);
		});
		it('should send new code param to view and remove from session', async () => {
			const userId = '649418158b915f0018524cb7';
			const expectedURL = 'manage-appeals/enter-code';
			const expectedContext = {
				lpaUserId: userId,
				requestNewCodeLink: '/manage-appeals/request-new-code',
				showNewCode: true
			};
			const { ENTER_CODE, CODE_EXPIRED, NEED_NEW_CODE, REQUEST_NEW_CODE, DASHBOARD } = lpaViews;
			const views = {
				ENTER_CODE,
				CODE_EXPIRED,
				NEED_NEW_CODE,
				REQUEST_NEW_CODE,
				DASHBOARD
			};
			const returnedFunction = getEnterCodeLPA(views);
			req.params.id = userId;
			req.session.enterCode = {
				newCode: true
			};
			await returnedFunction(req, res);
			expect(res.render).toHaveBeenCalledWith(expectedURL, expectedContext);
			expect(req.enterCode?.newCode).toBe(undefined);
		});
		it('should send token to user if user exists', async () => {
			const userId = '649418158b915f0018524cb7';
			const expectedURL = 'manage-appeals/enter-code';
			const expectedContext = {
				lpaUserId: userId,
				requestNewCodeLink: '/manage-appeals/request-new-code'
			};
			const fakeUserResponse = {
				email: 'test@example.com'
			};
			const { ENTER_CODE, CODE_EXPIRED, NEED_NEW_CODE, REQUEST_NEW_CODE, DASHBOARD } = lpaViews;
			const views = {
				ENTER_CODE,
				CODE_EXPIRED,
				NEED_NEW_CODE,
				REQUEST_NEW_CODE,
				DASHBOARD
			};

			getLPAUser.mockResolvedValue(fakeUserResponse);
			mockGrant();

			const returnedFunction = getEnterCodeLPA(views);
			req.params.id = userId;

			await returnedFunction(req, res);

			expect(res.render).toHaveBeenCalledWith(expectedURL, expectedContext);
			expect(mockedGrant).toHaveBeenCalledWith({
				action: enterCodeConfig.actions.lpaDashboard,
				email: fakeUserResponse.email,
				grant_type: AUTH.GRANT_TYPE.OTP,
				resource: AUTH.RESOURCE
			});
		});
		it('should not send token to user if user lookup fails, but still render page', async () => {
			const userId = '649418158b915f0018524cb7';
			const expectedURL = 'manage-appeals/enter-code';
			const expectedContext = {
				lpaUserId: userId,
				requestNewCodeLink: '/manage-appeals/request-new-code'
			};
			const { ENTER_CODE, CODE_EXPIRED, NEED_NEW_CODE, REQUEST_NEW_CODE, DASHBOARD } = lpaViews;
			const views = {
				ENTER_CODE,
				CODE_EXPIRED,
				NEED_NEW_CODE,
				REQUEST_NEW_CODE,
				DASHBOARD
			};

			getLPAUser.mockRejectedValue(new Error('Failed'));

			const returnedFunction = getEnterCodeLPA(views);
			req.params.id = userId;

			await returnedFunction(req, res);

			expect(res.render).toHaveBeenCalledWith(expectedURL, expectedContext);
			expect(getLPAUser).toHaveBeenCalledWith(req, userId);
			expect(sendToken).not.toBeCalled();
		});
	});

	describe('postEnterCodeLPA', () => {
		it('should post the code', async () => {
			const { ENTER_CODE, CODE_EXPIRED, NEED_NEW_CODE, REQUEST_NEW_CODE, DASHBOARD } = lpaViews;
			const views = {
				ENTER_CODE,
				CODE_EXPIRED,
				NEED_NEW_CODE,
				REQUEST_NEW_CODE,
				DASHBOARD
			};
			const userId = '649418158b915f0018524cb7';
			const code = '12345';
			isTokenValid.mockResolvedValue({
				valid: true
			});
			const mockUser = {
				email: 'a',
				enabled: true
			};
			getLPAUser.mockResolvedValue(mockUser);

			const returnedFunction = postEnterCodeLPA(views);

			req.params.id = userId;
			req.body = {
				'email-code': code
			};
			getLPAUserStatus.mockResolvedValue(STATUS_CONSTANTS.ADDED);
			await returnedFunction(req, res);
			expect(getLPAUserStatus).toHaveBeenCalledWith(req, userId);
			expect(setLPAUserStatus).toHaveBeenCalledWith(req, userId, STATUS_CONSTANTS.CONFIRMED);
			expect(res.redirect).toHaveBeenCalledWith('/manage-appeals/your-appeals');
		});
		it('should redirect on too many attempts', async () => {
			const { ENTER_CODE, CODE_EXPIRED, NEED_NEW_CODE, REQUEST_NEW_CODE, DASHBOARD } = lpaViews;
			const views = {
				ENTER_CODE,
				CODE_EXPIRED,
				NEED_NEW_CODE,
				REQUEST_NEW_CODE,
				DASHBOARD
			};
			const userId = '649418158b915f0018524cb7';
			const code = '12345';

			isTokenValid.mockReturnValue({
				valid: false,
				tooManyAttempts: true
			});

			const mockUser = {
				email: 'a',
				enabled: true
			};
			getLPAUser.mockResolvedValue(mockUser);

			const returnedFunction = postEnterCodeLPA(views);

			req.params.id = userId;
			req.body = {
				'email-code': code
			};

			await returnedFunction(req, res);
			expect(res.redirect).toHaveBeenCalledWith(`/manage-appeals/need-new-code/${userId}`);
		});
		it('should redirect on token expired', async () => {
			const { ENTER_CODE, CODE_EXPIRED, NEED_NEW_CODE, REQUEST_NEW_CODE, DASHBOARD } = lpaViews;
			const views = {
				ENTER_CODE,
				CODE_EXPIRED,
				NEED_NEW_CODE,
				REQUEST_NEW_CODE,
				DASHBOARD
			};
			const userId = '649418158b915f0018524cb7';
			const code = '12345';

			isTokenValid.mockReturnValue({
				valid: false,
				expired: true
			});

			const mockUser = {
				email: 'a',
				enabled: true
			};
			getLPAUser.mockResolvedValue(mockUser);

			const returnedFunction = postEnterCodeLPA(views);

			req.params.id = userId;
			req.body = {
				'email-code': code
			};

			await returnedFunction(req, res);
			expect(res.redirect).toHaveBeenCalledWith(`/manage-appeals/code-expired/${userId}`);
		});

		it('should set the user session', async () => {
			const { ENTER_CODE, CODE_EXPIRED, NEED_NEW_CODE, REQUEST_NEW_CODE, DASHBOARD } = lpaViews;
			const views = {
				ENTER_CODE,
				CODE_EXPIRED,
				NEED_NEW_CODE,
				REQUEST_NEW_CODE,
				DASHBOARD
			};
			const userId = '649418158b915f0018524cb7';
			const code = '12345';
			const mockUser = {
				email: 'a',
				enabled: true
			};
			isTokenValid.mockReturnValue({
				valid: true
			});

			getLPAUser.mockResolvedValue(mockUser);

			const returnedFunction = postEnterCodeLPA(views);

			req.params.id = userId;
			req.body = {
				'email-code': code
			};

			await returnedFunction(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/manage-appeals/your-appeals');
		});
	});
});
