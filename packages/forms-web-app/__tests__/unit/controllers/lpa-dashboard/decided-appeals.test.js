const { getCaseFixture } = require('@pins/common/__tests__/fixtures/appeal-cases.fixture.js');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_DECISION_OUTCOME
} = require('@planning-inspectorate/data-model');

const { getDecidedAppeals } = require('../../../../src/controllers/lpa-dashboard/decided-appeals');
const { getUserFromSession } = require('../../../../src/services/user.service');
const { VIEW } = require('../../../../src/lib/views');

const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/services/user.service');

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
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.COMPLETE,
			APPEAL_CASE_PROCEDURE.WRITTEN
		).setDecisionOutcome(APPEAL_CASE_DECISION_OUTCOME.ALLOWED, true)
	},
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.INVALID,
			APPEAL_CASE_PROCEDURE.WRITTEN
		).setDecisionOutcome(APPEAL_CASE_DECISION_OUTCOME.INVALID, false)
	}
];

describe('controllers/lpa-dashboard/your-appeals', () => {
	beforeEach(() => {
		req.appealsApiClient = {
			getDecidedAppealsCaseDataV2: jest.fn()
		};

		jest.resetAllMocks();
	});

	describe('getDecidedAppeals', () => {
		it('should render the decided appeals view with correctly mapped and filtered data', async () => {
			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getDecidedAppealsCaseDataV2.mockResolvedValue(mockAppealData);

			await getDecidedAppeals(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.DECIDED_APPEALS, {
				lpaName: mockUser.lpaName,
				decidedAppeals: [
					expect.objectContaining({
						caseDecisionOutcomeDate: expect.any(String)
					}),
					expect.objectContaining({
						caseDecisionOutcomeDate: expect.any(String)
					})
				],
				yourAppealsLink: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`
			});
		});

		it('should render the decided appeals view with no data', async () => {
			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getDecidedAppealsCaseDataV2.mockResolvedValue([]);

			await getDecidedAppeals(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.DECIDED_APPEALS, {
				lpaName: mockUser.lpaName,
				decidedAppeals: [],
				yourAppealsLink: `/${VIEW.LPA_DASHBOARD.DASHBOARD}`
			});
		});
	});
});
