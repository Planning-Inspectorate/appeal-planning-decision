const { getConfirmAddUser } = require('../../../../src/controllers/lpa-dashboard/confirm-add-user');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = {
	...mockReq(null)
};
const res = mockRes();

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
});
