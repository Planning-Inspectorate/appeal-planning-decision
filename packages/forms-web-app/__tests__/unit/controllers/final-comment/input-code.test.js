const {
	getInputCode,
	postInputCode,
	getInputCodeResendCode
} = require('../../../../src/controllers/final-comment/input-code');
const { sendToken } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		FINAL_COMMENT: { INPUT_CODE, NEED_NEW_CODE, COMMENTS_QUESTION }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { isTokenValid } = require('../../../../src/lib/is-token-valid');
const {
	validation: {
		securityCodeMaxAttempts: { finalComment: finalCommentSecurityCodeMaxAttempts }
	}
} = require('../../../../src/config');
const { enterCodeConfig } = require('@pins/common');

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
		it('should call the appeals-api-wrapper sendToken method with ID and email address from the finalComment session object', async () => {
			// TODO: update this test to mock req.session.finalComment once that data is no longer hardcoded

			await getInputCode(req, res);

			expect(sendToken).toBeCalledWith(
				'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				enterCodeConfig.actions.saveAndReturn,
				'test@planninginspectorate.gov.uk'
			);
		});
		it('should render the enter code page', async () => {
			await getInputCode(req, res);

			expect(res.render).toBeCalledWith(INPUT_CODE, {
				requestNewCodeLink: 'input-code/resend-code',
				showNewCode: undefined
			});
		});

		it('should delete req.session.resendCode after rendering page correctly', async () => {
			req.session.resendCode = true;

			await getInputCode(req, res);
			expect(res.render).toBeCalledWith(INPUT_CODE, {
				requestNewCodeLink: 'input-code/resend-code',
				showNewCode: true
			});
			expect(req.session.resendCode).toBe(undefined);
		});
	});
	describe('postInputCode', () => {
		beforeEach(() => {
			req.session.finalComment = {
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				email: 'test@planninginspectorate.gov.uk'
			};
		});
		it('should re-render the enter code page in an error state if errors are present in the body', async () => {
			// TODO: update this test to mock req.session.finalComment once that data is no longer hardcoded
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
		});
		it('should increment req.session.finalComment.incorrectSecurityCodeAttempts by one, and re-render the enter code page in an error state with the expected error message text, if the entered token is not valid', async () => {
			// TODO: update this test to mock req.session.finalComment once that data is no longer hardcoded
			req.body = {
				'email-code': '68365'
			};

			isTokenValid.mockReturnValue(false);

			req.session.finalComment.incorrectSecurityCodeAttempts = 0;

			await postInputCode(req, res);

			expect(req.session.finalComment.incorrectSecurityCodeAttempts).toBe(1);
			expect(res.render).toBeCalledWith(INPUT_CODE, {
				token: req.body['email-code'],
				errors: true,
				errorSummary: [{ text: 'Enter a correct code', href: '#' }]
			});
		});
		it('should reset req.session.finalComment.incorrectSecurityCodeAttempts to zero, and redirect to the need-new-code page, if the entered token is not valid and an incorrect code has been entered more than finalCommentSecurityCodeMaxAttempts times', async () => {
			// TODO: update this test to mock req.session.finalComment once that data is no longer hardcoded
			req.body = {
				'email-code': '68365'
			};

			isTokenValid.mockReturnValue(false);

			req.session.finalComment.incorrectSecurityCodeAttempts = finalCommentSecurityCodeMaxAttempts;

			await postInputCode(req, res);

			expect(res.redirect).toBeCalledWith(`/${NEED_NEW_CODE}`);
		});
		it('should redirect to the comments-question page if the entered token is valid', async () => {
			// TODO: update this test to mock req.session.finalComment once that data is no longer hardcoded
			req.body = {
				'email-code': '68365'
			};

			isTokenValid.mockReturnValue({ valid: true });

			await postInputCode(req, res);

			expect(res.redirect).toBeCalledWith(`/${COMMENTS_QUESTION}`);
		});
	});

	describe('getInputCodeResendCode', () => {
		it('should set session correctly and redirect to input code page', () => {
			req.session.resendCode = null;
			getInputCodeResendCode(req, res);
			expect(req.session.resendCode).toBe(true);
			expect(res.redirect).toBeCalledWith(`/${INPUT_CODE}`);
		});
	});
});
