const { getCaseFixture } = require('@pins/common/__tests__/fixtures/appeal-cases.fixture.js');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');

const {
	getWithdrawnAppeals
} = require('../../../../src/controllers/lpa-dashboard/withdrawn-appeals');
const { getUserFromSession } = require('../../../../src/services/user.service');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/services/user.service');

describe('controllers/lpa-dashboard/withdrawn-appeals', () => {
	let req;
	let res;

	const mockUser = {
		lpaCode: 'E60000',
		lpaName: 'Test LPA'
	};

	const mockWithdrawnData = [
		{
			...getCaseFixture(
				CASE_TYPES.HAS.processCode,
				APPEAL_CASE_STATUS.WITHDRAWN,
				APPEAL_CASE_PROCEDURE.WRITTEN
			).markAsWithdrawn()
		},
		{
			...getCaseFixture(
				CASE_TYPES.HAS.processCode,
				APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
				APPEAL_CASE_PROCEDURE.WRITTEN
			).setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID, new Date('2025-12-01')),
			lpaQuestionnaireDueDate: new Date('2025-12-01')
		}
	];

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
		req.appealsApiClient.getAppealsCaseDataV2.mockResolvedValue(mockWithdrawnData);

		await getWithdrawnAppeals(req, res);

		expect(req.appealsApiClient.getAppealsCaseDataV2).toHaveBeenCalledWith(mockUser.lpaCode);
		expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.WITHDRAWN_APPEALS, {
			lpaName: mockUser.lpaName,
			withdrawnAppeals: [
				expect.objectContaining({
					caseWithdrawnDate: expect.any(String)
				}),
				expect.objectContaining({
					caseWithdrawnDate: expect.any(String)
				})
			],
			yourAppealsLink: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`
		});
	});

	it('should render the withdrawn appeals view with no data', async () => {
		req.appealsApiClient.getAppealsCaseDataV2.mockResolvedValue([]);

		await getWithdrawnAppeals(req, res);

		expect(req.appealsApiClient.getAppealsCaseDataV2).toHaveBeenCalledWith(mockUser.lpaCode);
		expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.WITHDRAWN_APPEALS, {
			lpaName: mockUser.lpaName,
			withdrawnAppeals: [],
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
