const {
	getConfirmRemoveUser,
	postConfirmRemoveUser
} = require('../../../../src/controllers/lpa-dashboard/confirm-remove-user');
const { getUserFromSession } = require('../../../../src/services/user.service');
const { VIEW } = require('#lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = {
	...mockReq(null),
	appealsApiClient: {
		getUserById: jest.fn(),
		removeLPAUser: jest.fn()
	}
};
const res = mockRes();

jest.mock('../../../../src/services/user.service');

const mockUser = {
	id: 'abc',
	lpaCode: 'Q9999',
	email: 'test@example.com'
};

const mockRemoveUser = {
	id: 'abcd',
	lpaCode: 'Q9999',
	email: 'test1@example.com'
};

const mockOtherLpaUser = {
	id: 'abcde',
	lpaCode: 'Q1111',
	email: 'test2@example.com'
};

describe('controllers/lpa-dashboard/get-confirm-remove-user', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getConfirmRemoveUserUser', () => {
		it('should render the view correctly', async () => {
			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getUserById.mockImplementation(() => Promise.resolve(mockRemoveUser));

			await getConfirmRemoveUser(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.CONFIRM_REMOVE_USER, {
				removeUserEmailAddress: mockRemoveUser.email
			});
		});

		it('should error if user is removing a user from another lpa', async () => {
			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getUserById.mockImplementation(() => Promise.resolve(mockOtherLpaUser));

			await getConfirmRemoveUser(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.CONFIRM_REMOVE_USER, {
				removeUserEmailAddress: mockOtherLpaUser.email,
				errors: {},
				errorSummary: [{ text: 'Unable to remove user', href: '#' }]
			});
		});
	});

	describe('postConfirmRemoveUserUser', () => {
		it('should remove the user', async () => {
			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getUserById.mockImplementation(() => Promise.resolve(mockRemoveUser));

			await postConfirmRemoveUser(req, res);

			expect(req.appealsApiClient.removeLPAUser).toHaveBeenCalledWith(mockRemoveUser.id);
			expect(req.session.removeUserEmailAddress).toEqual(mockRemoveUser.email);
		});

		it('should error if user is removing a user from another lpa', async () => {
			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getUserById.mockImplementation(() => Promise.resolve(mockOtherLpaUser));

			await postConfirmRemoveUser(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.CONFIRM_REMOVE_USER, {
				removeUserEmailAddress: mockOtherLpaUser.email,
				errors: {},
				errorSummary: [{ text: 'Unable to remove user', href: '#' }]
			});
		});
	});
});
