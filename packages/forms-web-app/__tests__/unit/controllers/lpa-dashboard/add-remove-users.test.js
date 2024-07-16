const { getAddRemoveUsers } = require('../../../../src/controllers/lpa-dashboard/add-remove-users');
const { VIEW } = require('#lib/views');
const { mockReq, mockRes } = require('../../mocks');

const { getUserFromSession } = require('../../../../src/services/user.service');

const req = {
	...mockReq(null),
	appealsApiClient: {
		getUsers: jest.fn()
	}
};
const res = mockRes();

jest.mock('#lib/appeals-api-wrapper');
jest.mock('../../../../src/services/user.service');

const mockUser = {
	lpaCode: 'test',
	email: 'test@example.com'
};

const mockUsersResponse = [{ a: 1 }, { a: 2 }];

describe('controllers/lpa-dashboard/add-remove-users', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getAddRemoveUsers', () => {
		it('should render the view with backlink to dashboard and link to email-address', async () => {
			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getUsers.mockImplementation(() => Promise.resolve(mockUsersResponse));

			await getAddRemoveUsers(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS, {
				dashboardUrl: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
				addUserLink: `/${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}`,
				removeUserLink: `/${VIEW.LPA_DASHBOARD.CONFIRM_REMOVE_USER}`,
				users: mockUsersResponse
			});
		});

		it('should render view with correct successMessage if req.session.addUserEmailAddress exists', async () => {
			req.session.addUserEmailAddress = 'test@example.com';
			const successMessage = [
				`test@example.com has been added to the account`,
				'They will receive an email with a link to the service'
			];

			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getUsers.mockImplementation(() => Promise.resolve(mockUsersResponse));

			await getAddRemoveUsers(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS, {
				dashboardUrl: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
				addUserLink: `/${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}`,
				removeUserLink: `/${VIEW.LPA_DASHBOARD.CONFIRM_REMOVE_USER}`,
				successMessage: successMessage,
				users: mockUsersResponse
			});
			expect(req.session.addUserEmailAddress).toBe(undefined);
		});

		it('should render view with correct successMessage if req.session.removeUserEmailAddress exists', async () => {
			req.session.removeUserEmailAddress = 'test@example.com';
			const successMessage = [`test@example.com has been removed`];

			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getUsers.mockImplementation(() => Promise.resolve(mockUsersResponse));

			await getAddRemoveUsers(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS, {
				dashboardUrl: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`,
				addUserLink: `/${VIEW.LPA_DASHBOARD.EMAIL_ADDRESS}`,
				removeUserLink: `/${VIEW.LPA_DASHBOARD.CONFIRM_REMOVE_USER}`,
				successMessage: successMessage,
				users: mockUsersResponse
			});
			expect(req.session.removeUserEmailAddress).toBe(undefined);
		});
	});
});
