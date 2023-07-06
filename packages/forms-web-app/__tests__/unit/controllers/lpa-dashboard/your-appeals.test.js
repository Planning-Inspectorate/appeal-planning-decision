const { getYourAppeals } = require('../../../../src/controllers/lpa-dashboard/your-appeals');
const { getLPA } = require('../../../../src/lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../../../src/services/lpa-user.service');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/lpa-user.service');

const req = {
	...mockReq(null)
};
const res = mockRes();

const mockUser = {
	lpaCode: 'test',
	email: 'test@example.com'
};

const mockLpa = {
	name: 'test-lpa'
};

describe('controllers/lpa-dashboard/your-appeals', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getYourAppeals', () => {
		it('should render the view with a link to add-remove', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			getLPA.mockResolvedValue(mockLpa);

			await getYourAppeals(req, res);

			expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
			expect(getLPA).toHaveBeenCalledWith(mockUser.lpaCode);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.DASHBOARD, {
				lpaName: mockLpa.name,
				addOrRemoveLink: `/${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}`
			});
		});
	});
});
