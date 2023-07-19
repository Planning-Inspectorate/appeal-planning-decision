const { getServiceInvite } = require('../../../../src/controllers/lpa-dashboard/service-invite');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const { getLPA, createUser, errorMessages } = require('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/appeals-api-wrapper');

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
			expect(createUser).not.toHaveBeenCalled();
		});

		const getLpaBadReturnValues = [null, { test: true }, { inTrial: 1 }, { inTrial: false }];
		getLpaBadReturnValues.forEach((value) => {
			it('should render the unauthorized view if getLPA returns a bad value', async () => {
				req.params.lpaCode = '123';
				getLPA.mockReturnValue(value);

				await getServiceInvite(req, res);

				expect(res.render).toHaveBeenCalledWith(VIEW.ERROR_PAGES.UNAUTHORIZED);
				expect(getLPA).toHaveBeenCalledWith(req.params.lpaCode);
				expect(createUser).not.toHaveBeenCalled();
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
			expect(createUser).not.toHaveBeenCalled();
		});

		it('should redirect to the enter email view if createUser returns an only1Admin error', async () => {
			req.params.lpaCode = '123';
			getLPA.mockReturnValue({ inTrial: true });
			createUser.mockImplementation(() => {
				throw new Error(errorMessages.user.only1Admin);
			});

			await getServiceInvite(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
			expect(getLPA).toHaveBeenCalledWith(req.params.lpaCode);
			expect(createUser).toHaveBeenCalled();
		});

		it('should render the unauthorized view if createUser throws error', async () => {
			req.params.lpaCode = '123';
			getLPA.mockReturnValue({ inTrial: true });
			createUser.mockImplementation(() => {
				throw new Error('Mocked error');
			});

			await getServiceInvite(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.ERROR_PAGES.UNAUTHORIZED);
			expect(getLPA).toHaveBeenCalledWith(req.params.lpaCode);
			expect(createUser).toHaveBeenCalled();
		});

		it('should redirect to the enter email view if user created works', async () => {
			req.params.lpaCode = '123';
			getLPA.mockReturnValue({ inTrial: true, email: 'test' });
			createUser.mockReturnValue({});

			await getServiceInvite(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.YOUR_EMAIL_ADDRESS}`);
			expect(getLPA).toHaveBeenCalledWith(req.params.lpaCode);
			expect(createUser).toHaveBeenCalledWith('test', true, '123');
		});
	});
});
