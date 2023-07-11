const {
	getYourEmailAddress,
	postYourEmailAddress
} = require('../../../../src/controllers/common/your-email-address');
const { getUserByEmail } = require('../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../mocks');
const views = require('../../../../src/lib/views');
const lpaViews = views.VIEW.LPA_DASHBOARD;

jest.mock('../../../../src/lib/appeals-api-wrapper');

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
			const testEmail = 'iamnoone@example.com';
			req.session.email = testEmail;
			const returnedFunction = getYourEmailAddress(lpaViews);
			await returnedFunction(req, res);
			expect(res.render).toBeCalledWith(`${lpaViews.YOUR_EMAIL_ADDRESS}`, {
				email: testEmail
			});
		});
	});
	describe('postYourEmailAddress', () => {
		it('/controllers/common/postYourEmailAddress.js', async () => {
			const testId = 'd1f31fc7-0152-4796-ab48-52adcdd95066';
			const testEmail = 'iamnoone@example.com';
			req.params.id = testId;
			req.body['email-address'] = testEmail;
			const returnedFunction = postYourEmailAddress(lpaViews);
			await returnedFunction(req, res);
			expect(res.redirect).toBeCalledWith(`/${lpaViews.ENTER_CODE}/${testId}`);
		});
		it('/controllers/common/postYourEmailAddress.js valid email address', async () => {
			const testId = 'd1f31fc7-0152-4796-ab48-52adcdd95066';
			const testEmail = 'iamnoone@example.com';
			req.params.id = testId;
			req.body['email-address'] = testEmail;
			getUserByEmail.mockReturnValue = {
				_id: '64abf5b59beabb0019775c23',
				email: 'admin1@planninginspectorate.gov.uk',
				isAdmin: true,
				enabled: true,
				lpaCode: 'Q9999'
			};
			const returnedFunction = postYourEmailAddress(lpaViews);
			await returnedFunction(req, res);
			expect(res.redirect).toBeCalledWith(`/${lpaViews.ENTER_CODE}/${testId}`);
		});
	});
});
