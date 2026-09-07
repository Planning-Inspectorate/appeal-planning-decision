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
const {
	getLPAUserStatus,
	setLPAUserStatus,
	getLPAUser
} = require('../../../../src/services/user.service');
const { isTokenValid } = require('#lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const { STATUS_CONSTANTS, AUTH } = require('@pins/common/src/constants');
const { isFeatureActive } = require('../../../../src/featureFlag');
const config = require('../../../../src/config');

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
		getLPAUser: jest.fn(),
		logoutUser: jest.fn()
	};
});
jest.mock('../../../../src/featureFlag');
const TEST_EMAIL = 'test@example.com';
const TEST_ID = '89aa8504-773c-42be-bb68-029716ad9756';

describe('controllers/common/enter-code', () => {
	let req;
	let res;
	const bannerHtmlOverride =
		config.betaBannerText +
		config.generateBetaBannerFeedbackLink(config.getAppealTypeFeedbackUrl(''));

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
		async function getConfirmEmailTest(newCode = undefined) {
			req = {
				...req,
				params: { enterCodeId: TEST_ID },
				session: { enterCode: { action: enterCodeConfig.actions.confirmEmail, newCode } }
			};
			const returnedFunction = getEnterCode(householderAppealViews, { isGeneralLogin: false });

			await returnedFunction(req, res);

			expect(res.render).toHaveBeenCalledWith(`${householderAppealViews.ENTER_CODE}`, {
				requestNewCodeLink: `/${householderAppealViews.REQUEST_NEW_CODE}`,
				confirmEmailLink: `/${householderAppealViews.EMAIL_ADDRESS}`,
				showNewCode: newCode,
				bannerHtmlOverride
			});

			if (newCode) {
				expect(req.session.enterCode?.newCode).toBe(undefined);
			}
		}

		beforeEach(() => {
			isFeatureActive.mockResolvedValue(true);
		});

		it('should handle general log in', async () => {
			req.session.email = TEST_EMAIL;
			const returnedFunction = getEnterCode(householderAppealViews, { isGeneralLogin: true });

			await returnedFunction(req, res);

			expect(res.render).toHaveBeenCalledWith(`${householderAppealViews.ENTER_CODE}`, {
				confirmEmailLink: `/${householderAppealViews.EMAIL_ADDRESS}`,
				requestNewCodeLink: `/${householderAppealViews.REQUEST_NEW_CODE}`,
				showNewCode: undefined,
				bannerHtmlOverride
			});
		});

		it('should handle confirm email for appeal', async () => {
			req.session.email = TEST_EMAIL;
			await getConfirmEmailTest();
		});

		it('should handle newCode confirm email', async () => {
			req.session.email = TEST_EMAIL;
			await getConfirmEmailTest(true);
		});
	});

	describe('postEnterCode', () => {
		beforeEach(() => {
			isTokenValid.mockReturnValue({
				valid: true,
				action: 'unused'
			});
			req.body = { 'email-code': '12312' };
		});

		it('should show validation errors to user', async () => {
			const { ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS } = fullAppealViews;

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

			const returnedFunction = postEnterCode(
				{ ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS },
				{ isGeneralLogin: false }
			);
			await returnedFunction(req, res);

			expect(res.render).toHaveBeenCalledWith(`${ENTER_CODE}`, {
				confirmEmailLink: '/full-appeal/submit-appeal/email-address',
				requestNewCodeLink: '/full-appeal/submit-appeal/request-new-code',
				token: req.body['email-code'],
				errors: errors,
				errorSummary: errorSummary
			});
			expect(isTokenValid).not.toHaveBeenCalled();
		});

		it('should render need new code page if too many attempts have been made', async () => {
			const { NEED_NEW_CODE } = fullAppealViews;
			req.session.appeal = {
				email: TEST_EMAIL
			};
			req.session.enterCode = {
				action: enterCodeConfig.actions.confirmEmail
			};

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
			req.session.enterCode = {
				action: enterCodeConfig.actions.confirmEmail
			};
			isTokenValid.mockReturnValue({
				expired: true
			});

			const returnedFunction = postEnterCode({ CODE_EXPIRED }, { isGeneralLogin: true });
			await returnedFunction(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${CODE_EXPIRED}`);
			expect(req.session.appeal).not.toEqual(fullAppeal);
		});

		it('should render page with error message if token invalid', async () => {
			const { ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS } = fullAppealViews;
			req.session.enterCode = {
				action: enterCodeConfig.actions.confirmEmail
			};
			isTokenValid.mockReturnValue({
				valid: false
			});

			const returnedFunction = postEnterCode(
				{ ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS },
				{ isGeneralLogin: true }
			);
			await returnedFunction(req, res);

			const errorMessage = 'Enter the code we sent to your email address';

			expect(res.render).toHaveBeenCalledWith(`${ENTER_CODE}`, {
				confirmEmailLink: '/full-appeal/submit-appeal/email-address',
				requestNewCodeLink: '/full-appeal/submit-appeal/request-new-code',
				token: req.body['email-code'],
				errors: {
					'email-code': { msg: errorMessage }
				},
				errorSummary: [{ text: errorMessage, href: '#email-code' }]
			});
		});

		describe('POST', () => {
			beforeEach(() => {
				isFeatureActive.mockResolvedValue(true);
			});

			const expectUserInSession = () => {
				expect(req.session.user).toEqual({
					email: expect.any(String),
					access_token: 'access',
					id_token: 'id',
					expiry: 'expiry'
				});
			};

			it('should redirect to your appeals for general log on', async () => {
				const { YOUR_APPEALS } = fullAppealViews;
				req.session.email = TEST_EMAIL;
				req.session.enterCode = {
					action: enterCodeConfig.actions.confirmEmail
				};
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
				req.session.appeal = { email: TEST_EMAIL };
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
				req.session.appeal = { email: TEST_EMAIL };
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

			it('should handle selected page request', async () => {
				const redirectPath = '/appeals/1234567';
				req.session.enterCode = {
					action: enterCodeConfig.actions.confirmEmail
				};
				req.session.appeal = { email: TEST_EMAIL };

				req.session.loginRedirect = redirectPath;
				req.session.navigationHistory = ['existing/path'];

				isTokenValid.mockResolvedValue({
					valid: true,
					access_token: 'access',
					id_token: 'id',
					access_token_expiry: 'expiry'
				});

				const returnedFunction = postEnterCode(fullAppealViews, { isGeneralLogin: false });
				await returnedFunction(req, res);

				expect(req.session.navigationHistory).toEqual(['existing/path']); // unchanged
				expect(res.redirect).toHaveBeenCalledWith(redirectPath);
			});
		});
	});

	describe('getEnterCodeLPA', () => {
		it('should render page', async () => {
			const expectedURL = 'manage-appeals/enter-code';
			const expectedContext = {
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
			await returnedFunction(req, res);
			expect(res.render).toHaveBeenCalledWith(expectedURL, expectedContext);
		});
		it('should send new code param to view and remove from session', async () => {
			const expectedURL = 'manage-appeals/enter-code';
			const expectedContext = {
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
			req.session.enterCode = {
				newCode: true
			};
			await returnedFunction(req, res);
			expect(res.render).toHaveBeenCalledWith(expectedURL, expectedContext);
			expect(req.session.enterCode?.newCode).toBe(undefined);
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
			const code = '12345';
			req.session.email = TEST_EMAIL;
			isTokenValid.mockResolvedValue({
				valid: true
			});
			const mockUser = {
				email: 'a',
				enabled: true
			};
			getLPAUser.mockResolvedValue(mockUser);

			const returnedFunction = postEnterCodeLPA(views);

			req.body = {
				'email-code': code
			};
			getLPAUserStatus.mockResolvedValue(STATUS_CONSTANTS.ADDED);
			await returnedFunction(req, res);
			expect(isTokenValid).toHaveBeenCalledWith(code, mockUser.email, undefined, [
				AUTH.SCOPES.USER_DETAILS.LPA
			]);
			expect(getLPAUserStatus).toHaveBeenCalledWith(req, TEST_EMAIL);
			expect(setLPAUserStatus).toHaveBeenCalledWith(req, TEST_EMAIL, STATUS_CONSTANTS.CONFIRMED);
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
			const code = '12345';
			req.session.email = TEST_EMAIL;
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

			req.body = {
				'email-code': code
			};

			await returnedFunction(req, res);
			expect(res.redirect).toHaveBeenCalledWith(`/manage-appeals/need-new-code`);
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
			const code = '12345';
			req.session.email = TEST_EMAIL;
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

			req.body = {
				'email-code': code
			};

			await returnedFunction(req, res);
			expect(res.redirect).toHaveBeenCalledWith(`/manage-appeals/code-expired`);
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
			const code = '12345';
			const mockUser = {
				email: 'a',
				enabled: true
			};
			req.session.email = TEST_EMAIL;
			isTokenValid.mockReturnValue({
				valid: true
			});

			getLPAUser.mockResolvedValue(mockUser);

			const returnedFunction = postEnterCodeLPA(views);

			req.body = {
				'email-code': code
			};

			await returnedFunction(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/manage-appeals/your-appeals');
		});

		it('redirects using session property if a document request', async () => {
			const views = {};
			const code = '12345';
			req.session.email = TEST_EMAIL;
			isTokenValid.mockResolvedValue({
				valid: true
			});
			const mockUser = {
				email: 'a',
				enabled: true
			};
			getLPAUser.mockResolvedValue(mockUser);

			const returnedFunction = postEnterCodeLPA(views);

			req.session.loginRedirect = '/lpa-questionnaire-document/1010101';
			req.body = {
				'email-code': code
			};
			getLPAUserStatus.mockResolvedValue(STATUS_CONSTANTS.ADDED);
			await returnedFunction(req, res);
			expect(getLPAUserStatus).toHaveBeenCalledWith(req, TEST_EMAIL);
			expect(setLPAUserStatus).toHaveBeenCalledWith(req, TEST_EMAIL, STATUS_CONSTANTS.CONFIRMED);
			expect(res.redirect).toHaveBeenCalledWith('/lpa-questionnaire-document/1010101');
			expect(req.session.loginRedirect).toEqual(undefined);
		});

		it('should handle selected page request', async () => {
			const views = {};
			const code = '12345';
			req.session.email = TEST_EMAIL;
			isTokenValid.mockResolvedValue({ valid: true });
			getLPAUser.mockResolvedValue({ email: 'lpa@example.com' });
			getLPAUserStatus.mockResolvedValue(STATUS_CONSTANTS.ADDED);

			req.body = { 'email-code': code };

			req.session.loginRedirect = '/manage-appeals/1234567/';
			req.session.navigationHistory = ['already-there'];

			const returnedFunction = postEnterCodeLPA(views);

			await returnedFunction(req, res);

			expect(req.session.navigationHistory).toEqual(['already-there']);
			expect(req.session.loginRedirect).toBeUndefined();
			expect(res.redirect).toHaveBeenCalledWith('/manage-appeals/1234567/');
		});
	});
});
