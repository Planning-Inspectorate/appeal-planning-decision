const {
	getInputCode,
	postInputCode,
	getInputCodeResendCode
} = require('../../../../src/controllers/final-comment/input-code');
const { sendToken, getFinalCommentData } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		FINAL_COMMENT: { INPUT_CODE, NEED_NEW_CODE, COMMENTS_QUESTION, CODE_EXPIRED }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { isTokenValid } = require('../../../../src/lib/is-token-valid');
const { enterCodeConfig } = require('@pins/common');
const finalComment = require('../../../mockData/final-comment');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/is-token-valid');

describe('controllers/final-comment/input-code', () => {
	let req;
	let res;
	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});
	describe('getInputCode', () => {
		it('should call the appeals-api-wrapper getFinalCommentData method with req.params.caseReference if no final comment in session', async () => {
			getFinalCommentData.mockReturnValue(finalComment);
			req.params.caseReference = 'mock-params';

			await getInputCode(req, res);

			expect(getFinalCommentData).toBeCalledWith('mock-params');
		});

		it('should not call getFinalCommentData if final comment exists in session with matching case reference', async () => {
			req.session.finalComment = finalComment;
			req.session.finalComment.horizonId = '123456789';
			req.params.caseReference = '123456789';

			await getInputCode(req, res);

			expect(getFinalCommentData).not.toBeCalled();
			expect(req.session.userTokenId).toEqual('123456789');
		});

		it('should call getFinalCommentData if final comment in session with different case reference', async () => {
			req.session.finalComment = finalComment;
			req.session.finalComment.horizonId = '987654321';
			req.params.caseReference = '123456789';
			getFinalCommentData.mockReturnValue(finalComment);

			await getInputCode(req, res);

			expect(getFinalCommentData).toBeCalledWith('123456789');
			expect(req.session.userTokenId).toEqual('123456789');
		});

		it('should re-render input code page if final comment api throws an error', async () => {
			req.params.caseReference = '111222333';

			getFinalCommentData.mockRejectedValue(() => {
				new Error('error');
			});

			try {
				await getInputCode(req, res);
			} catch (e) {
				expect(sendToken).not.toBeCalled();
				expect(res.render).toBeCalledWith(`${INPUT_CODE}/111222333`);
			}
		});

		it('should call the appeals-api-wrapper sendToken method with ID and email address from the finalComment session object', async () => {
			getFinalCommentData.mockReturnValue(finalComment);

			await getInputCode(req, res);

			expect(sendToken).toBeCalledWith(
				'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				enterCodeConfig.actions.saveAndReturn,
				'test@planninginspectorate.gov.uk'
			);
		});
		it('should render the enter code page', async () => {
			getFinalCommentData.mockReturnValue(finalComment);
			req.params.caseReference = 'fake-case-reference';

			await getInputCode(req, res);

			expect(res.render).toBeCalledWith(INPUT_CODE, {
				requestNewCodeLink: 'resend-code/fake-case-reference',
				showNewCode: undefined
			});
		});

		it('should show new code success message only once', async () => {
			getFinalCommentData.mockReturnValue(finalComment);
			req.session.resendCode = false;
			req.session.enterCode = {
				newCode: true
			};
			req.params.caseReference = 'another-fake-reference';

			await getInputCode(req, res);
			expect(res.render).toBeCalledWith(INPUT_CODE, {
				requestNewCodeLink: 'resend-code/another-fake-reference',
				showNewCode: true
			});
			expect(req.session.enterCode.newCode).toBe(undefined);
		});
	});
	describe('postInputCode', () => {
		beforeEach(() => {
			req.session = { finalComment };
		});
		it('should re-render the enter code page in an error state if errors are present in the body', async () => {
			req.body = {
				errors: {
					'test-error': {
						msg: 'Test error message'
					}
				},
				errorSummary: [{ text: 'Test error summary text' }]
			};

			await postInputCode(req, res);

			expect(res.render).toBeCalledWith(INPUT_CODE, {
				token: req.body['email-code'],
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			expect(req.session.finalComment.secureCodeEnteredCorrectly).toBe(false);
		});
		it('should re-render the enter code page in an error state with the expected error message text, if the entered token is not valid', async () => {
			req.body = {
				'email-code': '68365'
			};

			isTokenValid.mockReturnValue({ valid: false, expired: false });

			await postInputCode(req, res);

			expect(res.render).toBeCalledWith(INPUT_CODE, {
				token: req.body['email-code'],
				errors: true,
				errorSummary: [{ text: 'Enter a correct code', href: '#' }]
			});
			expect(req.session.finalComment.secureCodeEnteredCorrectly).toBe(false);
		});
		it('should redirect to the need-new-code page, if the entered token is not valid and an incorrect code has been entered more than the allowed number of times', async () => {
			req.body = {
				'email-code': '68365'
			};

			isTokenValid.mockReturnValue({ valid: false, expired: false, tooManyAttempts: true });

			await postInputCode(req, res);

			expect(res.redirect).toBeCalledWith(`/${NEED_NEW_CODE}`);
			expect(req.session.finalComment.secureCodeEnteredCorrectly).toBe(false);
		});

		it('should redirect to the need-new-code page, if the entered token has expired', async () => {
			req.body = {
				'email-code': '12345'
			};

			isTokenValid.mockReturnValue({ valid: false, expired: true });

			await postInputCode(req, res);

			expect(res.redirect).toBeCalledWith(`/${CODE_EXPIRED}`);
			expect(req.session.finalComment.secureCodeEnteredCorrectly).toBe(false);
		});

		it('should redirect to the comments-question page if the entered token is valid', async () => {
			req.body = {
				'email-code': '68365'
			};
			req.session.userTokenId = 'mock-id';

			isTokenValid.mockReturnValue({ valid: true });

			await postInputCode(req, res);

			expect(res.redirect).toBeCalledWith(`/${COMMENTS_QUESTION}`);
			expect(req.session.finalComment.secureCodeEnteredCorrectly).toBe(true);
			expect(req.session.userTokenId).toBe(undefined);
		});
	});

	describe('getInputCodeResendCode', () => {
		it('should set session correctly and redirect to input code page', () => {
			req.session.enterCode = null;
			req.params.caseReference = 'mock-reference';
			getInputCodeResendCode(req, res);
			expect(req.session.enterCode.newCode).toBe(true);
			expect(res.redirect).toBeCalledWith(`/${INPUT_CODE}/mock-reference`);
		});
	});
});
