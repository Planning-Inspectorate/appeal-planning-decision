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

const mockAppealData = [
	{
		_id: '89aa8504-773c-42be-bb68-029716ad9756',
		LPAApplicationReference: '12/3456789/PLA',
		caseReference: 'APP/Q9999/W/22/3221288',
		questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00'
	}
];

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
				appealsCaseData: mockAppealData,
				appealDetailsLink: `/${VIEW.LPA_DASHBOARD.APPEAL_DETAILS}`,
				appealQuestionnaireLink: `/${VIEW.LPA_QUESTIONNAIRE.QUESTIONNAIRE}`
			});
		});

		it('should call API to fetch appeals case data', async () => {
			getLPAUserFromSession.mockReturnValue(mockUser);

			await getYourAppeals(req, res);

			expect(getAppealsCaseData).toHaveBeenCalledWith(mockUser.lpaCode);
		});
	});
});
