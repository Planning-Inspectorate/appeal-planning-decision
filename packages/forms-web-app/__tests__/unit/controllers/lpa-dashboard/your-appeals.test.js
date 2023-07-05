const { getYourAppeals } = require('../../../../src/controllers/lpa-dashboard/your-appeals');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = {
	...mockReq(null)
};
const res = mockRes();

describe('controllers/lpa-dashboard/your-appeals', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getYourAppeals', () => {
		it('should render the view with a link to add-remove', async () => {
			getYourAppeals(req, res);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.DASHBOARD, {
				addOrRemoveLink: `/${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}`
			});
		});
	});
});
