const {
	getR6EmailAddress,
	postR6EmailAddress
} = require('../../../../src/controllers/rule-6/email-address');

const { VIEW } = require('../../../../src/lib/views');
const rule6Views = VIEW.RULE_6;
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/user.service');

describe('controllers/rule-6/email-address', () => {
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

	describe('getR6EmailAddress', () => {
		it('should render the view', async () => {
			const testEmail = 'testR6user@planninginspectorate.gov.uk';

			req.session.email = testEmail;
			const returnedFunction = getR6EmailAddress(rule6Views);
			await returnedFunction(req, res);
			expect(res.render).toHaveBeenCalledWith(rule6Views.EMAIL_ADDRESS, {
				email: testEmail
			});
		});
	});

	describe('postR6Address', () => {
		it('redirect to enter code', async () => {
			const testId = '64c789bf8672ef00122fe30c';
			const testEmail = 'testR6user@planninginspectorate.gov.uk';
			req.appealsApiClient.getUserByEmailV2.mockImplementation(() =>
				Promise.resolve({
					id: testId,
					email: 'testR6user@planninginspectorate.gov.uk'
				})
			);

			req.body['email-address'] = testEmail;
			const returnedFunction = postR6EmailAddress(rule6Views);
			await returnedFunction(req, res);
			expect(res.redirect).toHaveBeenCalledWith(`/${rule6Views.ENTER_CODE}/${testId}`);
		});
		it('should error with missing email address', async () => {
			const customErrorSummary = [
				{
					text: 'Enter an email address in the correct format, like name@example.com',
					href: '#email-address'
				}
			];
			const returnedFunction = postR6EmailAddress(rule6Views);
			await returnedFunction(req, res);
			expect(res.render).toHaveBeenCalledWith(rule6Views.EMAIL_ADDRESS, {
				errors: {},
				errorSummary: customErrorSummary
			});
		});
	});
});
