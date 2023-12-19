const {
	getEnterCode,
	postEnterCode,
	getEnterCodeLPA,
	postEnterCodeLPA
} = require('../../../../src/controllers/common/enter-code');
const views = require('../../../../src/lib/views');
const householderAppealViews = views.VIEW.APPELLANT_SUBMISSION;
const fullAppealViews = views.VIEW.FULL_APPEAL;
const lpaViews = views.VIEW.LPA_DASHBOARD;
const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');
const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { mockReq, mockRes } = require('../../mocks');
const {
	getSavedAppeal,
	getExistingAppeal,
	sendToken,
	getUserById
} = require('../../../../src/lib/appeals-api-wrapper');
const {
	getLPAUserStatus,
	setLPAUserStatus,
	getLPAUser
} = require('../../../../src/services/lpa-user.service');
const {
	isTokenValid,
	isTestEnvironment,
	isTestLpaAndToken
} = require('../../../../src/lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const { utils } = require('@pins/common');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('@pins/common/src/client/appeals-api-client');
jest.mock('../../../../src/lib/is-token-valid');
jest.mock('../../../../src/lib/is-token-valid');
jest.mock('../../../../src/services/lpa-user.service', () => {
	return {
		getLPAUserStatus: jest.fn(),
		createLPAUserSession: jest.fn(),
		setLPAUserStatus: jest.fn(),
		getLPAUser: jest.fn()
	};
});

describe('controllers/full-appeal/submit-appeal/enter-code', () => {
	let req;
	let res;
	beforeEach(() => {
		req = mockReq();
		req = {
			...req,
			body: {}
		};
		delete req.session.appeal;
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getEnterCode', () => {
		it('should render page but not call sendToken when no req.params.id or appeal in session', async () => {
			const { REQUEST_NEW_CODE, ENTER_CODE, EMAIL_ADDRESS } = householderAppealViews;
			const url = `/${REQUEST_NEW_CODE}`;

			const returnedFunction = getEnterCode({ REQUEST_NEW_CODE, ENTER_CODE, EMAIL_ADDRESS });
			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
				requestNewCodeLink: url,
				confirmEmailLink: null,
				showNewCode: undefined
			});
			expect(sendToken).not.toBeCalled();
			expect(req.session.userTokenId).not.toBeDefined();
		});

		it('should redirect to enter-code/:id when an appeal id exists in session and no req.params.id provided', async () => {
			const { ENTER_CODE, EMAIL_ADDRESS } = fullAppealViews;
			req.session.appeal = fullAppeal;

			const returnedFunction = getEnterCode({ ENTER_CODE, EMAIL_ADDRESS });
			await returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${req.session.appeal.id}`);
			expect(sendToken).not.toBeCalled();
			expect(req.session.userTokenId).not.toBeDefined();
		});

		it('should delete newCode from session if present', async () => {
			const { ENTER_CODE, EMAIL_ADDRESS } = fullAppealViews;
			req.session.appeal = fullAppeal;
			req.session.enterCode = {
				newCode: true
			};

			const returnedFunction = getEnterCode({ ENTER_CODE, EMAIL_ADDRESS });
			await returnedFunction(req, res);

			expect(req.session.enterCode?.newCode).toBe(undefined);
		});

		describe('when req.params.id is provided', () => {
			it('should render page if sendToken call succeeds', async () => {
				const { ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS } = householderAppealViews;
				const url = `/${REQUEST_NEW_CODE}`;
				req = {
					...req,
					params: { id: '89aa8504-773c-42be-bb68-029716ad9756' }
				};
				sendToken.mockReturnValue({});

				const returnedFunction = getEnterCode({ ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS });
				await returnedFunction(req, res);

				expect(sendToken).toBeCalled();
				expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
					requestNewCodeLink: url,
					confirmEmailLink: null,
					showNewCode: undefined
				});
				expect(req.session.userTokenId).toEqual(req.params.id);
			});

			it('should set confirm email url if action is set', async () => {
				const { ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS } = householderAppealViews;
				const url = `/${REQUEST_NEW_CODE}`;
				req = {
					...req,
					params: { id: '89aa8504-773c-42be-bb68-029716ad9756' }
				};
				sendToken.mockReturnValue({});

				req.session.enterCode = {
					action: enterCodeConfig.actions.confirmEmail
				};

				const returnedFunction = getEnterCode({ ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS });
				await returnedFunction(req, res);

				expect(sendToken).toBeCalled();
				expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
					requestNewCodeLink: url,
					confirmEmailLink: `/${EMAIL_ADDRESS}`,
					showNewCode: undefined
				});
				expect(req.session.userTokenId).toEqual(req.params.id);
			});

			it('should render page but not call sendToken if validation errors in req.session', async () => {
				const { ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS } = fullAppealViews;
				const url = `/${REQUEST_NEW_CODE}`;
				const errors = { 'mock-error': 'Error message' };

				req = {
					...req,
					params: { id: '89aa8504-773c-42be-bb68-029716ad9756' },
					body: {
						errors
					}
				};

				const returnedFunction = getEnterCode({ ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS });
				await returnedFunction(req, res);

				expect(sendToken).not.toBeCalled();
				expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
					requestNewCodeLink: url,
					confirmEmailLink: null,
					showNewCode: undefined
				});
				expect(req.session.userTokenId).toEqual(req.params.id);
			});

			it('should render page if sendToken call fails', async () => {
				const { ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS } = householderAppealViews;
				const url = `/${REQUEST_NEW_CODE}`;
				req = {
					...req,
					params: { id: '90aa8504-773c-42be-bb68-029716ad9756' }
				};
				sendToken.mockRejectedValue(() => {
					new Error('error');
				});

				const returnedFunction = getEnterCode({ ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS });
				await returnedFunction(req, res);

				expect(sendToken).toBeCalled();
				expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
					requestNewCodeLink: url,
					confirmEmailLink: null,
					showNewCode: undefined
				});
				expect(req.session.userTokenId).toEqual(req.params.id);
			});

			it('should set req.session.enterCode.action if value is not set', async () => {
				const { ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS } = householderAppealViews;
				req = {
					...req,
					params: { id: '89aa8504-773c-42be-bb68-029716ad9756' }
				};
				sendToken.mockReturnValue({});

				const returnedFunction = getEnterCode({ ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS });
				await returnedFunction(req, res);

				expect(req.session.enterCode.action).toEqual('saveAndReturn');
			});
			it('should use any preexisting req.session.enterCode.action value', async () => {
				const { ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS } = householderAppealViews;
				req = {
					...req,
					params: { id: '89aa8504-773c-42be-bb68-029716ad9756' },
					session: { enterCode: { action: 'test' } }
				};
				sendToken.mockReturnValue({});

				const returnedFunction = getEnterCode({ ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS });
				await returnedFunction(req, res);

				expect(req.session.enterCode.action).toEqual('test');
			});

			it('should delete req.session.enterCode.newCode if it exists', async () => {
				const { ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS } = householderAppealViews;
				req = {
					...req,
					params: { id: '89aa8504-773c-42be-bb68-029716ad9756' },
					session: { enterCode: { newCode: true } }
				};
				sendToken.mockReturnValue({});

				const returnedFunction = getEnterCode({ ENTER_CODE, REQUEST_NEW_CODE, EMAIL_ADDRESS });
				await returnedFunction(req, res);

				expect(req.session.enterCode.newCode).not.toBeDefined();
			});
		});
	});
	describe('postEnterCode', () => {
		it('should render page with errors if input validation fails', async () => {
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
				params: { id: 'not-a-valid-id' }
			};

			const returnedFunction = postEnterCode({ ENTER_CODE });
			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
				token: req.body['email-code'],
				errors: errors,
				errorSummary: errorSummary
			});
			expect(isTokenValid).not.toBeCalled();
			expect(getSavedAppeal).not.toBeCalled();
			expect(getExistingAppeal).not.toBeCalled();
		});

		it('should render need new code page if too many attempts have been made', async () => {
			const { NEED_NEW_CODE } = fullAppealViews;
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2020-07-14T13:00:48.024Z'
			});
			getExistingAppeal.mockReturnValue({
				fullAppeal
			});

			isTokenValid.mockReturnValue({
				tooManyAttempts: true
			});

			const returnedFunction = postEnterCode({ NEED_NEW_CODE });
			await returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${NEED_NEW_CODE}`);
			expect(req.session.appeal).not.toEqual(fullAppeal);
		});

		it('should render code expired page when token is expired', async () => {
			const { CODE_EXPIRED } = fullAppealViews;
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2020-07-14T13:00:48.024Z'
			});
			getExistingAppeal.mockReturnValue({
				fullAppeal
			});
			isTokenValid.mockReturnValue({
				expired: true
			});

			const returnedFunction = postEnterCode({ CODE_EXPIRED });
			await returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${CODE_EXPIRED}`);
			expect(req.session.appeal).not.toEqual(fullAppeal);
		});

		it('should render page with error message if token invalid', async () => {
			const { ENTER_CODE } = fullAppealViews;
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue({
				valid: false
			});

			const returnedFunction = postEnterCode({ ENTER_CODE });
			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
				errors: {},
				errorSummary: [{ text: 'Enter a correct code', href: '#email-code' }]
			});
		});

		it('should render email confirmed page if email action', async () => {
			const { EMAIL_CONFIRMED } = fullAppealViews;
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue({
				valid: true,
				action: enterCodeConfig.actions.confirmEmail
			});

			const returnedFunction = postEnterCode({ EMAIL_CONFIRMED });
			await returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${EMAIL_CONFIRMED}`);
		});

		it('should render page with error message if token ok but appeal not found', async () => {
			const { ENTER_CODE } = fullAppealViews;
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue({
				valid: true
			});

			getSavedAppeal.mockRejectedValue(() => {
				new Error('error');
			});

			const returnedFunction = postEnterCode({ ENTER_CODE });
			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
				errors: {},
				errorSummary: [
					{ text: 'We did not find your appeal. Enter the correct code', href: '#email-code' }
				]
			});
		});

		it('should render appeal already submitted page when appeal is already complete', async () => {
			const { APPEAL_ALREADY_SUBMITTED } = householderAppealViews;
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue({
				valid: true
			});

			getExistingAppeal.mockReturnValue({
				...householderAppeal,
				state: 'SUBMITTED'
			});

			const returnedFunction = postEnterCode({ APPEAL_ALREADY_SUBMITTED });
			await returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${APPEAL_ALREADY_SUBMITTED}`);
		});

		it('should render task list page when entering valid token', async () => {
			const { TASK_LIST } = householderAppealViews;
			const draftAppeal = {
				...householderAppeal,
				state: 'DRAFT'
			};

			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue({
				valid: true
			});
			getExistingAppeal.mockReturnValue(draftAppeal);

			const returnedFunction = postEnterCode({ TASK_LIST });
			await returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${TASK_LIST}`);
			expect(req.session.appeal).toEqual(draftAppeal);
		});

		it('Should accept a test code value when the LPA is the test LPA and is test environment returns true', async () => {
			let token = '12345';
			const { EMAIL_CONFIRMED } = fullAppealViews;
			req.body = { token: token };
			getSavedAppeal.mockReturnValue({
				token: token,
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTestEnvironment.mockReturnValue(true);
			isTestLpaAndToken.mockReturnValue(true);
			const returnedFunction = postEnterCode({ EMAIL_CONFIRMED });
			await returnedFunction(req, res);
			expect(isTokenValid).not.toBeCalled();
			expect(res.redirect).toBeCalledWith(`/${EMAIL_CONFIRMED}`);
		});
		it('should render page with error message if test token used but test environment is false', async () => {
			const { ENTER_CODE } = fullAppealViews;
			let token = '12345';

			req.body = {
				token: token,
				session: {
					appeal: {
						lpaCode: utils.testLPACode
					}
				}
			};
			isTestEnvironment.mockReturnValue(false);
			isTokenValid.mockReturnValue({ valid: false });
			const returnedFunction = postEnterCode({ ENTER_CODE });
			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
				errors: {},
				errorSummary: [{ text: 'Enter a correct code', href: '#email-code' }]
			});
		});

		it('should render page with error message if test tokenused but not test LPA code and test environment is true', async () => {
			const { ENTER_CODE } = fullAppealViews;
			let token = '12345';

			req.body = {
				token: token,
				session: {
					appeal: {
						lpaCode: 'E1234567'
					}
				}
			};
			isTestEnvironment.mockReturnValue(true);
			isTokenValid.mockReturnValue({ valid: false });
			const returnedFunction = postEnterCode({ ENTER_CODE });
			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
				errors: {},
				errorSummary: [{ text: 'Enter a correct code', href: '#email-code' }]
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
			expect(res.render).toBeCalledWith(expectedURL, expectedContext);
		});
		it('should redirect if user id is not in a valid format', async () => {
			const userId = 'i_am_not_a_valid_user_id';
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
			req.params.id = userId;
			await returnedFunction(req, res);
			expect(res.redirect).toBeCalledWith(expectedURL);
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
			expect(res.redirect).toBeCalledWith(expectedURL);
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
			expect(res.render).toBeCalledWith(expectedURL, expectedContext);
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

			getUserById.mockResolvedValue(fakeUserResponse);

			const returnedFunction = getEnterCodeLPA(views);
			req.params.id = userId;

			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(expectedURL, expectedContext);
			expect(getUserById).toBeCalledWith(userId);
			expect(sendToken).toBeCalledWith(
				userId,
				enterCodeConfig.actions.lpaDashboard,
				fakeUserResponse.email
			);
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

			getUserById.mockImplementation(() => {
				throw new Error('Failed');
			});

			const returnedFunction = getEnterCodeLPA(views);
			req.params.id = userId;

			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(expectedURL, expectedContext);
			expect(getUserById).toBeCalledWith(userId);
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
			expect(getLPAUserStatus).toHaveBeenCalledWith(userId);
			expect(setLPAUserStatus).toHaveBeenCalledWith(userId, STATUS_CONSTANTS.CONFIRMED);
			expect(res.redirect).toBeCalledWith('/manage-appeals/your-appeals');
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
			expect(res.redirect).toBeCalledWith(`/manage-appeals/need-new-code/${userId}`);
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
			expect(res.redirect).toBeCalledWith(`/manage-appeals/code-expired/${userId}`);
		});
		it('should redirect on test environment', async () => {
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

			isTestEnvironment.mockReturnValue(true);
			isTestLpaAndToken.mockReturnValue(true);
			getLPAUser.mockResolvedValue({
				_id: userId,
				email: 'admin1@planninginspectorate.gov.uk',
				isAdmin: true,
				enabled: true,
				lpaCode: 'Q9999'
			});
			const returnedFunction = postEnterCodeLPA(views);

			req.params.id = userId;
			req.body = {
				'email-code': code
			};

			await returnedFunction(req, res);
			expect(res.redirect).toBeCalledWith('/manage-appeals/your-appeals');
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

			expect(res.redirect).toBeCalledWith('/manage-appeals/your-appeals');
		});
	});
});
