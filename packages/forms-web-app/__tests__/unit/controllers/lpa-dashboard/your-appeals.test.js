const { getYourAppeals } = require('../../../../src/controllers/lpa-dashboard/your-appeals');
const { getLPAUserFromSession } = require('../../../../src/services/lpa-user.service');

const { VIEW } = require('../../../../src/lib/views');
const { baseHASUrl } = require('../../../../src/dynamic-forms/has-questionnaire/journey');

const { mockReq, mockRes } = require('../../mocks');
const { apiClient } = require('../../../../src/lib/appeals-api-client');
const {
	mapToLPADashboardDisplayData,
	isToDoLPADashboard
} = require('../../../../src/lib/dashboard-functions');
const { isFeatureActive } = require('../../../../src/featureFlag');

jest.mock('../../../../src/services/lpa-user.service');
jest.mock('../../../../src/lib/appeals-api-client');
jest.mock('../../../../src/lib/dashboard-functions');
jest.mock('../../../../src/featureFlag');

const req = {
	...mockReq(null)
};
const res = mockRes();

const mockUser = {
	lpaCode: 'test',
	email: 'test@example.com',
	lpaName: 'test-lpa'
};

const mockAppealData = {
	_id: '89aa8504-773c-42be-bb68-029716ad9756',
	LPAApplicationReference: '12/3456789/PLA',
	caseReference: 'APP/Q9999/W/22/3221288',
	questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
	appealType: 'Full Planning (S78) Appeal',
	siteAddressLine1: 'Test Address 1',
	siteAddressLine2: 'Test Address 2',
	siteAddressTown: 'Test Town',
	siteAddressPostcode: 'TS1 1TT'
};

const mockDecidedCount = {
	count: 1
};

describe('controllers/lpa-dashboard/your-appeals', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('getYourAppeals', () => {
		it('should render the view with a link to add-remove', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			apiClient.getAppealsCaseDataV2.mockResolvedValue([mockAppealData]);
			apiClient.getDecidedAppealsCountV2.mockResolvedValue(mockDecidedCount);
			mapToLPADashboardDisplayData.mockReturnValue(mockAppealData);
			isToDoLPADashboard.mockReturnValue(true);
			isFeatureActive.mockResolvedValueOnce(false);

			await getYourAppeals(req, res);

			expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.DASHBOARD, {
				lpaName: mockUser.lpaName,
				addOrRemoveLink: `/${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}`,
				toDoAppeals: [mockAppealData],
				waitingForReviewAppeals: [],
				appealDetailsLink: `/${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}`,
				appealQuestionnaireLink: baseHASUrl,
				showQuestionnaire: false,
				decidedAppealsLink: `/${VIEW.LPA_DASHBOARD.DECIDED_APPEALS}`,
				decidedAppealsCount: 1
			});
		});

		it('should show questionnaire ', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			apiClient.getAppealsCaseDataV2.mockResolvedValue([mockAppealData]);
			apiClient.getDecidedAppealsCountV2.mockResolvedValue(mockDecidedCount);
			mapToLPADashboardDisplayData.mockReturnValue(mockAppealData);
			isToDoLPADashboard.mockReturnValue(true);
			isFeatureActive.mockResolvedValueOnce(true);

			await getYourAppeals(req, res);

			expect(getLPAUserFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.DASHBOARD, {
				lpaName: mockUser.lpaName,
				addOrRemoveLink: `/${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}`,
				toDoAppeals: [mockAppealData],
				waitingForReviewAppeals: [],
				appealDetailsLink: `/${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}`,
				appealQuestionnaireLink: baseHASUrl,
				showQuestionnaire: true,
				decidedAppealsLink: `/${VIEW.LPA_DASHBOARD.DECIDED_APPEALS}`,
				decidedAppealsCount: 1
			});
		});

		it('should call API to fetch appeals case data', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);
			apiClient.getAppealsCaseDataV2.mockResolvedValue([mockAppealData]);
			apiClient.getDecidedAppealsCountV2.mockResolvedValue(mockDecidedCount);
			mapToLPADashboardDisplayData.mockReturnValue(mockAppealData);
			isToDoLPADashboard.mockReturnValue(true);

			await getYourAppeals(req, res);

			expect(apiClient.getAppealsCaseDataV2).toHaveBeenCalledWith(mockUser.lpaCode);
		});
	});
});
