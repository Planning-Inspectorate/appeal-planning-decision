const { getServiceInvite } = require('../../../../src/controllers/lpa-dashboard/service-invite');
const { VIEW } = require('#lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { apiClient } = require('#lib/appeals-api-client');

const { getLPA, errorMessages } = require('#lib/appeals-api-wrapper');
jest.mock('#lib/appeals-api-wrapper');
jest.mock('#lib/appeals-api-client');

const req = {
	...mockReq(null)
};
const res = mockRes();

describe('controllers/lpa-dashboard/service-invite', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	describe('getServiceInvite', () => {
		it('should render the unauthorized view without an lpaCode', async () => {
			getServiceInvite(req, res);
			expect(res.render).toHaveBeenCalledWith(VIEW.ERROR_PAGES.UNAUTHORIZED);
			expect(getLPA).not.toHaveBeenCalled();

			expect(apiClient.createUser).not.toHaveBeenCalled();
		});

		const getLpaBadReturnValues = [null, { test: true }, { inTrial: 1 }, { inTrial: false }];
		getLpaBadReturnValues.forEach((value) => {
			it('should render the unauthorized view if getLPA returns a bad value', async () => {
				req.params.lpaCode = '123';
				getLPA.mockReturnValue(value);

				await getServiceInvite(req, res);

				expect(res.render).toHaveBeenCalledWith(VIEW.ERROR_PAGES.UNAUTHORIZED);
				expect(getLPA).toHaveBeenCalledWith(req.params.lpaCode);
				expect(apiClient.createUser).not.toHaveBeenCalled();
			});
		});

		it('should render the unauthorized view if getLPA throws an error', async () => {
			req.params.lpaCode = '123';
			getLPA.mockImplementation(() => {
				throw new Error('Mocked error');
			});

			await getServiceInvite(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ERROR_PAGES.UNAUTHORIZED);
			expect(getLPA).toHaveBeenCalledWith(req.params.lpaCode);
			expect(apiClient.createUser).not.toHaveBeenCalled();
		});

		it('should redirect to the enter email view if apiClient.createUser returns an only1Admin error', async () => {
			req.params.lpaCode = '123';
			getLPA.mockReturnValue({ inTrial: true });
			apiClient.createUser.mockImplementation(() => {
				throw new Error(errorMessages.user.only1Admin);
			});

			await getServiceInvite(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
			expect(getLPA).toHaveBeenCalledWith(req.params.lpaCode);
			expect(apiClient.createUser).toHaveBeenCalled();
		});

		it('should render the unauthorized view if apiClient.createUser throws error', async () => {
			req.params.lpaCode = '123';
			getLPA.mockReturnValue({ inTrial: true });
			apiClient.createUser.mockImplementation(() => {
				throw new Error('Mocked error');
			});

			await getServiceInvite(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ERROR_PAGES.UNAUTHORIZED);
			expect(getLPA).toHaveBeenCalledWith(req.params.lpaCode);
			expect(apiClient.createUser).toHaveBeenCalled();
		});

		it('should redirect to the enter email view if user created works', async () => {
			req.params.lpaCode = '123';
			getLPA.mockReturnValue({ inTrial: true, email: 'test' });
			apiClient.createUser.mockImplementation(() => Promise.resolve({}));

			await getServiceInvite(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
			expect(getLPA).toHaveBeenCalledWith(req.params.lpaCode);
			expect(apiClient.createUser).toHaveBeenCalledWith({
				email: 'test',
				isLpaAdmin: true,
				isLpaUser: true,
				lpaCode: req.params.lpaCode
			});
		});
	});
});
