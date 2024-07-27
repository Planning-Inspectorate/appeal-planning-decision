const {
	getConfirmAddUser,
	postConfirmAddUser
} = require('../../../../src/controllers/lpa-dashboard/confirm-add-user');
const { getUserFromSession } = require('../../../../src/services/user.service');
const { VIEW } = require('#lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/services/user.service');

const req = {
	...mockReq(null),
	appealsApiClient: {
		createUser: jest.fn()
	}
};
const res = mockRes();

const mockUser = {
	lpaCode: 'Q9999',
	email: 'test@example.com',
	lpaDomain: 'test.example.com'
};

describe('controllers/lpa-dashboard/get-confirm-add-user', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getConfirmAddUser', () => {
		it('should render the view correctly', async () => {
			req.session.addUserEmailAddress = 'test@example.com';

			getConfirmAddUser(req, res);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.CONFIRM_ADD_USER, {
				addUserEmailAddress: 'test@example.com'
			});
		});
	});

	describe('postConfirmAddUser', () => {
		it('should call createUser with email address and redirect to correct page', async () => {
			const addUserEmailAddress = 'addUser@example.com';
			req.session.addUserEmailAddress = addUserEmailAddress;
			getUserFromSession.mockReturnValue(mockUser);

			await postConfirmAddUser(req, res);

			expect(req.appealsApiClient.createUser).toHaveBeenCalledWith({
				email: addUserEmailAddress,
				isLpaUser: true,
				lpaCode: mockUser.lpaCode
			});
			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}`);
		});

		it('should re-render template with errors if any api errors', async () => {
			const error = 'API error';
			req.appealsApiClient.createUser.mockImplementation(() => Promise.reject(error));

			req.session.addUserEmailAddress = 'test@example.com';
			getUserFromSession.mockReturnValue(mockUser);

			await postConfirmAddUser(req, res);

			expect(res.redirect).not.toHaveBeenCalled();
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.CONFIRM_ADD_USER, {
				addUserEmailAddress: 'test@example.com',
				errors: {},
				errorSummary: [{ text: 'Unable to add user', href: '#' }]
			});
		});
	});
});
