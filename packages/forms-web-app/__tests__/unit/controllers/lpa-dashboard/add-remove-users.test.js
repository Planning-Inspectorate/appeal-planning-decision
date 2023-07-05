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
	});
});
