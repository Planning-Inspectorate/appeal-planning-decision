const {
	getWithdrawnAppeals
} = require('../../../../src/controllers/lpa-dashboard/withdrawn-appeals');
const { getUserFromSession } = require('../../../../src/services/user.service');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { mapToLPADashboardDisplayData } = require('../../../../src/lib/dashboard-functions');
const { sortByDateFieldDesc } = require('@pins/common/src/lib/appeal-sorting');

jest.mock('../../../../src/services/user.service');
jest.mock('../../../../src/lib/dashboard-functions');
jest.mock('@pins/common/src/lib/appeal-sorting');

describe('controllers/lpa-dashboard/withdrawn-appeals', () => {
	let req;
	let res;

	const mockUser = {
		lpaCode: 'E60000',
		lpaName: 'Test LPA'
	};

	const mockWithdrawnData = {
		appealNumber: '1234567',
		address: '123 Test Lane',
		caseWithdrawnDate: '2025-12-01',
		appealType: 'Planning'
	};

	beforeEach(() => {
		jest.resetAllMocks();
		req = {
			...mockReq(),
			appealsApiClient: {
				getAppealsCaseDataV2: jest.fn()
			}
		};
		res = mockRes();

		getUserFromSession.mockReturnValue(mockUser);
	});

	it('should render the withdrawn appeals view with correctly mapped and filtered data', async () => {
		const rawApiData = [
			{ caseReference: '1234567', caseWithdrawnDate: '2025-12-01' },
			{ caseReference: '7654321' }
		];

		req.appealsApiClient.getAppealsCaseDataV2.mockResolvedValue(rawApiData);
		mapToLPADashboardDisplayData.mockReturnValue(mockWithdrawnData);
		sortByDateFieldDesc.mockReturnValue(() => 0);

		await getWithdrawnAppeals(req, res);

		expect(req.appealsApiClient.getAppealsCaseDataV2).toHaveBeenCalledWith(mockUser.lpaCode);
		expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.WITHDRAWN_APPEALS, {
			lpaName: mockUser.lpaName,
			withdrawnAppeals: [mockWithdrawnData],
			yourAppealsLink: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`
		});
	});

	it('should log an error if the API call fails', async () => {
		req.appealsApiClient.getAppealsCaseDataV2.mockRejectedValue(new Error('API error'));

		await getWithdrawnAppeals(req, res);
		expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.WITHDRAWN_APPEALS, {
			lpaName: mockUser.lpaName,
			withdrawnAppeals: [],
			yourAppealsLink: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`
		});
	});
});
