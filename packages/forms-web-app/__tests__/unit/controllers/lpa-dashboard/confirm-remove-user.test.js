const {
	getConfirmRemoveUser,
	postConfirmRemoveUser
} = require('../../../../src/controllers/lpa-dashboard/confirm-remove-user');
const { getUserById, removeUser } = require('../../../../src/lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../../../src/services/lpa-user.service');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = {
	...mockReq(null)
};
const res = mockRes();

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/lpa-user.service');

const mockUser = {
	lpaCode: 'Q9999',
	email: 'test@example.com'
};

const mockRemoveUser = {
	lpaCode: 'Q9999',
	email: 'test1@example.com'
};

const mockOtherLpaUser = {
	lpaCode: 'Q1111',
	email: 'test2@example.com'
};

describe('controllers/lpa-dashboard/get-confirm-remove-user', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getConfirmRemoveUserUser', () => {
		it('should render the view correctly', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			getUserById.mockResolvedValue(mockRemoveUser);

			await getConfirmRemoveUser(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.CONFIRM_REMOVE_USER, {
				removeUserEmailAddress: mockRemoveUser.email
			});
		});

		it('should error if user is removing a user from another lpa', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			getUserById.mockResolvedValue(mockOtherLpaUser);

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
			getLPAUserFromSession.mockReturnValue(mockUser);
			getUserById.mockResolvedValue(mockRemoveUser);

			await postConfirmRemoveUser(req, res);

			expect(removeUser).toHaveBeenCalledWith(mockRemoveUser._id);
			expect(req.session.removeUserEmailAddress).toEqual(mockRemoveUser.email);
		});

		it('should error if user is removing a user from another lpa', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			getUserById.mockResolvedValue(mockOtherLpaUser);

			await postConfirmRemoveUser(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.CONFIRM_REMOVE_USER, {
				removeUserEmailAddress: mockOtherLpaUser.email,
				errors: {},
				errorSummary: [{ text: 'Unable to remove user', href: '#' }]
			});
		});
	});
});
