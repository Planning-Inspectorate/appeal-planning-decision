const enterAppealDetailsController = require('../../../../src/controllers/submit-appeal/enter-appeal-details');

const { VIEW } = require('../../../../src/lib/submit-appeal/views');
const { mockReq, mockRes } = require('../../mocks');
const errors = {
	'appellant-email': 'Error message',
	'application-number': 'Error message'
};
const errorSummary = [{ text: 'There was an error', href: '#' }];

// dummy method mock: replace with import and mock for valid method when built
const sendEmailWithCodeSpy = jest.spyOn(enterAppealDetailsController, 'sendEmailWithCode');

describe('controllers/submit-appeal/enter-appeal-details', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getEnterAppealDetails', () => {
		it('getEnterAppealDetails method calls the correct template', async () => {
			await enterAppealDetailsController.getEnterAppealDetails(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.SUBMIT_APPEAL.ENTER_APPEAL_DETAILS);
		});
	});

	describe('postEnterAppealDetails', () => {
		it('should redirect to correct page if valid user input', async () => {
			const email = 'test@example.com';
			const number = '123456789';
			req = {
				...req,
				body: { 'appellant-email': email, 'application-number': number }
			};
			await enterAppealDetailsController.postEnterAppealDetails(req, res);

			expect(sendEmailWithCodeSpy).toHaveBeenCalledWith(email, number);
			expect(res.redirect).toHaveBeenCalledWith(VIEW.SUBMIT_APPEAL.ENTER_CODE);
		});

		it('should re-render the template with errors if submission validation fails', async () => {
			req = {
				...req,
				body: {
					['appellant-email']: 'invalid@',
					['application-number']: '',
					errors,
					errorSummary
				}
			};

			await enterAppealDetailsController.postEnterAppealDetails(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(VIEW.SUBMIT_APPEAL.ENTER_APPEAL_DETAILS, {
				applicationNumber: '',
				emailAddress: 'invalid@',
				errorSummary,
				errors
			});
		});

		it('should re-render the template with errors if an error is thrown', async () => {
			req = { body: { ['appellant-email']: 'test@example.com', ['application-number']: '123' } };
			const error = new Error('Internal Server Error');

			sendEmailWithCodeSpy.mockImplementation(() => Promise.reject(error));

			await enterAppealDetailsController.postEnterAppealDetails(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(VIEW.SUBMIT_APPEAL.ENTER_APPEAL_DETAILS, {
				applicationNumber: '123',
				emailAddress: 'test@example.com',
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});
	});
});
