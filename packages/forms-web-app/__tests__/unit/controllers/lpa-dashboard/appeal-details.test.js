const { getAppealDetails } = require('../../../../src/controllers/lpa-dashboard/appeal-details');
const { getLPAUserFromSession } = require('../../../../src/services/lpa-user.service');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/services/lpa-user.service');

const req = {
	...mockReq(null)
};
const res = mockRes();

const mockUser = {
	lpaCode: 'test',
	email: 'test@example.com',
	lpaName: 'test-lpa'
};

describe('controllers/lpa-dashboard/your-appeals', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getAppealDetails', () => {
		it('should render the view with a link to add-remove', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);

			await getAppealDetails(req, res);

			expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.APPEAL_DETAILS, {
				lpaName: mockUser.lpaName,
				dashboardLink: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`
			});
		});
	});
});
