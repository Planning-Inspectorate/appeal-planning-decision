const {
	getEnterSecurityCode,
	postEnterSecurityCode
} = require('../../../../src/controllers/final-comment/enter-security-code');
const { sendToken } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		FINAL_COMMENT: { ENTER_CODE }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { isTokenValid } = require('../../../../src/lib/is-token-valid');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/is-token-valid');

describe('controllers/final-comment/enter-security-code', () => {
	let req;
	let res;
	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});
	describe('getEnterSecurityCode', () => {
		it('should call the appeals-api-wrapper sendToken method with ID and email address from the finalComment session object', async () => {
			// TODO: update this test to mock req.session.finalComment once that data is no longer hardcoded

			await getEnterSecurityCode(req, res);

			expect(sendToken).toBeCalledWith(
				'e2813fb0-e269-4fe2-890e-6405dbd4a5ea',
				'test@planninginspectorate.gov.uk'
			);
		});
		it('should render the enter code page', async () => {
			await getEnterSecurityCode(req, res);

			expect(res.render).toBeCalledWith(ENTER_CODE);
		});
	});
	describe('postEnterSecurityCode', () => {
		beforeEach(() => {
			req.session.finalComment = {
				id: 'e2813fb0-e269-4fe2-890e-6405dbd4a5ea'
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

			await postEnterSecurityCode(req, res);

			expect(res.render).toBeCalledWith(ENTER_CODE, {
				token: req.body['email-code'],
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
		});
		it('should re-render the enter code page in an error state if the entered token is not valid', async () => {
			// TODO: update this test to mock req.session.finalComment once that data is no longer hardcoded

			req.body = {
				'email-code': '68365'
			};

			isTokenValid.mockReturnValue(false);

			await postEnterSecurityCode(req, res);

			expect(res.render).toBeCalledWith(ENTER_CODE, {
				token: req.body['email-code'],
				errors: true,
				errorSummary: [{ text: 'Enter a correct code', href: '#' }]
			});
		});
		it('should redirect to the comments-question page if the entered token is valid', async () => {
			// TODO: update this test to mock req.session.finalComment once that data is no longer hardcoded

			req.body = {
				'email-code': '68365'
			};

			isTokenValid.mockReturnValue(true);

			await postEnterSecurityCode(req, res);

			expect(res.redirect).toBeCalledWith('/full-appeal/submit-final-comment/comments-question');
		});
	});
});
