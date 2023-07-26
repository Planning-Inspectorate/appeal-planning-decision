const { getYourAppeals } = require('../../../../src/controllers/lpa-dashboard/your-appeals');
const { getLPAUserFromSession } = require('../../../../src/services/lpa-user.service');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { getAppealsCaseData } = require('../../../../src/lib/appeals-api-wrapper');

jest.mock('../../../../src/services/lpa-user.service');
jest.mock('../../../../src/lib/appeals-api-wrapper');

const req = {
	...mockReq(null)
};
const res = mockRes();

const mockUser = {
	lpaCode: 'test',
	email: 'test@example.com',
	lpaName: 'test-lpa'
};

const mockAppealData = [1, 2];

describe('controllers/lpa-dashboard/your-appeals', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getYourAppeals', () => {
		it('should render the view with a link to add-remove', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			getAppealsCaseData.mockResolvedValue(mockAppealData);
			await getYourAppeals(req, res);

			expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.DASHBOARD, {
				lpaName: mockUser.lpaName,
				addOrRemoveLink: `/${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}`,
				appealDetailsLink: `/${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}`,
				appealsCaseData: mockAppealData
			});
		});

		it('should call API to fetch appeals case data', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);

			await getYourAppeals(req, res);

			expect(getAppealsCaseData).toHaveBeenCalledWith(mockUser.lpaCode);
		});
	});
});
