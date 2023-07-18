const {
	getYourEmailAddress,
	postYourEmailAddress
} = require('../../../../src/controllers/common/your-email-address');
const { mockReq, mockRes } = require('../../mocks');
const views = require('../../../../src/lib/views');
const lpaViews = views.VIEW.LPA_DASHBOARD;

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
	describe('getYourEmailAddress', () => {
		it('controllers/common/getYourEmailAddress.js', async () => {
			const testEmail = 'iamnoone@@planninginspectorate.gov.uk';
			req.session.email = testEmail;
			const returnedFunction = getYourEmailAddress(lpaViews);
			await returnedFunction(req, res);
			expect(res.render).toBeCalledWith(`${lpaViews.YOUR_EMAIL_ADDRESS}`, {
				email: testEmail
			});
		});
	});
	describe('postYourEmailAddress', () => {
		it('/controllers/common/getYourEmailAddress.js', async () => {
			const testId = 'd1f31fc7-0152-4796-ab48-52adcdd95066';
			const testEmail = 'iamnoone@@planninginspectorate.gov.uk';
			req.params.id = testId;
			req.body['email-address'] = testEmail;
			const returnedFunction = postYourEmailAddress(lpaViews);
			await returnedFunction(req, res);
			expect(res.redirect).toBeCalledWith(`/${lpaViews.ENTER_CODE}/${testId}`);
		});
		it('/controllers.common.getYourEmailAddress.js missing email address', async () => {
			const customErrorSummary = [
				{
					text: 'Enter an email address in the correct format, like name@example.com',
					href: '#your-email-address'
				}
			];
			const returnedFunction = postYourEmailAddress(lpaViews);
			await returnedFunction(req, res);
			expect(res.render).toBeCalledWith(lpaViews.YOUR_EMAIL_ADDRESS, {
				errors: {},
				errorSummary: customErrorSummary
			});
		});
	});
});
