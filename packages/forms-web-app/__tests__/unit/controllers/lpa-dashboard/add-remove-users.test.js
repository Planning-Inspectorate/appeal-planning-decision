const { getAddRemoveUsers } = require('../../../../src/controllers/lpa-dashboard/add-remove-users');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = {
	...mockReq(null)
};
const res = mockRes();

describe('controllers/lpa-dashboard/add-remove-users', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getAddRemoveUsers', () => {
		it('should render the view with backlink to dashboard and link to email-address', async () => {
			getAddRemoveUsers(req, res);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS, {
				dashboardUrl: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
				addUserLink: `/${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}`
			});
		});

		it('should render view with correct successMessage if req.session.addUserEmailAddress exists', async () => {
			req.session.addUserEmailAddress = 'test@example.com';
			const successMessage = [
				`test@example.com has been added to the account`,
				'They will receive an email with a link to the service'
			];

			getAddRemoveUsers(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS, {
				dashboardUrl: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
				addUserLink: `/${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}`,
				successMessage: successMessage
			});
			expect(req.session.addUserEmailAddress).toBe(undefined);
		});

		it('should render view with correct successMessage if req.session.removeUserEmailAddress exists', async () => {
			req.session.removeUserEmailAddress = 'test@example.com';
			const successMessage = [`test@example.com has been removed`];

			getAddRemoveUsers(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS, {
				dashboardUrl: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
				addUserLink: `/${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}`,
				successMessage: successMessage
			});
			expect(req.session.removeUserEmailAddress).toBe(undefined);
		});
	});
});
