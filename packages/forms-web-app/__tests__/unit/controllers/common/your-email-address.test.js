const {
	getYourEmailAddress,
	postYourEmailAddress
} = require('../../../../src/controllers/common/your-email-address');

const { mockReq, mockRes } = require('../../mocks');
const views = require('#lib/views');
const lpaViews = views.VIEW.LPA_DASHBOARD;

describe('controllers/full-appeal/submit-appeal/enter-code', () => {
	let req;
	let res;
	beforeEach(() => {
		req = mockReq();
		req = {
			...req,
			body: {},
			appealsApiClient: {
				getUserByEmailV2: jest.fn()
			}
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
		it('redirect to enter code', async () => {
			const testId = '64c789bf8672ef00122fe30c';
			const testEmail = 'iamnoone@@planninginspectorate.gov.uk';
			req.appealsApiClient.getUserByEmailV2.mockImplementation(() =>
				Promise.resolve({
					id: '64c789bf8672ef00122fe30c',
					email: 'admin1@planninginspectorate.gov.uk',
					isLpaAdmin: true,
					status: 'confirmed',
					lpaCode: 'Q9999'
				})
			);

			req.body['email-address'] = testEmail;
			const returnedFunction = postYourEmailAddress(lpaViews);
			await returnedFunction(req, res);
			expect(res.redirect).toBeCalledWith(`/${lpaViews.ENTER_CODE}/${testId}`);
		});
		it('should error with missing email address', async () => {
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
