const { getCaseFixture } = require('@pins/common/__tests__/fixtures/appeal-cases.fixture.js');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_DECISION_OUTCOME
} = require('@planning-inspectorate/data-model');

const { get } = require('../../../../../src/controllers/appeals/your-appeals/decided-appeals');

const { VIEW } = require('../../../../../src/lib/views');
const { mockReq, mockRes } = require('../../../mocks');

const now = new Date();
const hourAgo = new Date(now.setHours(now.getHours() - 1));
describe('controllers/appeals/your-appeals/decided-appeals', () => {
	let req;
	let res;

	const mockAppealData = [
		{
			...getCaseFixture(
				CASE_TYPES.HAS.processCode,
				APPEAL_CASE_STATUS.COMPLETE,
				APPEAL_CASE_PROCEDURE.WRITTEN
			).setDecisionOutcome(APPEAL_CASE_DECISION_OUTCOME.ALLOWED, true),
			caseDecisionOutcomeDate: now
		},
		{
			...getCaseFixture(
				CASE_TYPES.HAS.processCode,
				APPEAL_CASE_STATUS.INVALID,
				APPEAL_CASE_PROCEDURE.WRITTEN
			).setDecisionOutcome(APPEAL_CASE_DECISION_OUTCOME.INVALID, false),
			caseDecisionOutcomeDate: hourAgo
		}
	];

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();

		req.appealsApiClient = {
			getUserAppeals: jest.fn()
		};
	});

	it('should render the decided appeals view with correctly mapped and filtered data', async () => {
		req.appealsApiClient.getUserAppeals.mockImplementation(() => Promise.resolve(mockAppealData));

		await get(req, res);

		expect(res.render).toHaveBeenCalledWith(VIEW.YOUR_APPEALS.DECIDED_APPEALS, {
			decidedAppeals: [
				expect.objectContaining({
					caseDecisionOutcomeDate: expect.any(String),
					appealDecision: 'Allowed'
				}),
				expect.objectContaining({
					caseDecisionOutcomeDate: expect.any(String),
					appealDecision: 'Invalid'
				})
			]
		});
	});

	it('should render the decided appeals view with no data', async () => {
		req.appealsApiClient.getUserAppeals.mockImplementation(() => Promise.resolve([]));

		await get(req, res);

		expect(res.render).toHaveBeenCalledWith(VIEW.YOUR_APPEALS.DECIDED_APPEALS, {});
	});
});
