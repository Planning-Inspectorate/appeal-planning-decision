const {
	getYourEmailAddress,
	postYourEmailAddress
} = require('../../../../src/controllers/common/your-email-address');

const mapCache = require('../../../../src/lib/map-cache');

const { mockReq, mockRes } = require('../../mocks');
const views = require('#lib/views');
const lpaViews = views.VIEW.LPA_DASHBOARD;
const mockEmailUUIDcache = new mapCache(5);

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
			expect(res.render).toHaveBeenCalledWith(`${lpaViews.YOUR_EMAIL_ADDRESS}`, {
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
			const returnedFunction = postYourEmailAddress(lpaViews, mockEmailUUIDcache);
			await returnedFunction(req, res);
			expect(res.redirect).toHaveBeenCalledWith(`/${lpaViews.ENTER_CODE}/${testId}`);
		});

		it('redirect to enter code when a non LPA email which exists in the database is used', async () => {
			const testId = '64c789bf8672ef00122fe30c';
			const testEmail = 'iamnoone@planninginspectorate.gov.uk';
			req.appealsApiClient.getUserByEmailV2.mockImplementation(() =>
				Promise.resolve({
					id: '64c789bf8672ef00122fe30c',
					email: 'appellant1@planninginspectorate.gov.uk',
					isLpaAdmin: false,
					status: '',
					lpaCode: ''
				})
			);

			req.body['email-address'] = testEmail;
			const returnedFunction = postYourEmailAddress(lpaViews, mockEmailUUIDcache);
			await returnedFunction(req, res);
			expect(res.redirect).toHaveBeenCalledWith(`/${lpaViews.ENTER_CODE}/${testId}`);
		});

		it('redirect to enter code when an email is used which is not in the database', async () => {
			const testEmail = 'iamnoone@planninginspectorate.gov.uk';
			req.appealsApiClient.getUserByEmailV2.mockImplementation(() =>
				Promise.reject(new Error('No user found'))
			);

			req.body['email-address'] = testEmail;
			const returnedFunction = postYourEmailAddress(lpaViews, mockEmailUUIDcache);
			await returnedFunction(req, res);
			// we want to check that we have a UUID in the redirect URL, but as it is generated at runtime, we use a regex to match it
			const expectedURLRegex = new RegExp(
				`${lpaViews.ENTER_CODE}/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}`
			);
			expect(res.redirect).toHaveBeenCalledWith(expect.stringMatching(expectedURLRegex));
		});

		it('redirect to enter code when an email is used which is not in the database should be called with the same id within 5 minutes', async () => {
			const testEmail = 'iamnoone@planninginspectorate.gov.uk';

			jest.useFakeTimers().setSystemTime(new Date('2025-01-30T00:00:00.000Z'));

			req.appealsApiClient.getUserByEmailV2.mockImplementation(() =>
				Promise.reject(new Error('No user found'))
			);

			req.body['email-address'] = testEmail;

			let laterReq = mockReq();
			laterReq = { ...req };
			let laterRes = mockRes();

			const returnedFunction = postYourEmailAddress(lpaViews, mockEmailUUIDcache);
			await returnedFunction(req, res);
			const redirectURL = res.redirect.mock.calls[0][0];

			// 5 minutes later, we expect to call the same redirect URL
			jest.setSystemTime(new Date('2025-01-30T00:04:00.000Z'));
			const laterReturnedFunction = postYourEmailAddress(lpaViews, mockEmailUUIDcache);
			await laterReturnedFunction(laterReq, laterRes);
			expect(laterRes.redirect).toHaveBeenCalledWith(redirectURL);

			jest.useRealTimers();
		});

		it('should error with missing email address', async () => {
			const customErrorSummary = [
				{
					text: 'Enter an email address in the correct format, like name@example.com',
					href: '#your-email-address'
				}
			];
			const returnedFunction = postYourEmailAddress(lpaViews, mockEmailUUIDcache);
			await returnedFunction(req, res);
			expect(res.render).toHaveBeenCalledWith(lpaViews.YOUR_EMAIL_ADDRESS, {
				errors: {},
				errorSummary: customErrorSummary
			});
		});
	});
});
