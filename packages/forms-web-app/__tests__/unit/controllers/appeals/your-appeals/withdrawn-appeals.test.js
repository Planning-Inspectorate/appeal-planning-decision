const { getCaseFixture } = require('@pins/common/__tests__/fixtures/appeal-cases.fixture.js');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');

const { get } = require('../../../../../src/controllers/appeals/your-appeals/withdrawn-appeals');

const { VIEW } = require('../../../../../src/lib/views');
const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/appeals/your-appeals/withdrawn-appeals', () => {
	let req;
	let res;

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
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();

		req.appealsApiClient = {
			getUserAppeals: jest.fn()
		};
	});

	it('should render the withdrawn appeals view with correctly mapped and filtered data', async () => {
		req.appealsApiClient.getUserAppeals.mockImplementation(() =>
			Promise.resolve(mockWithdrawnData)
		);

		await get(req, res);

		expect(res.render).toHaveBeenCalledWith(VIEW.YOUR_APPEALS.WITHDRAWN_APPEALS, {
			withdrawnAppeals: [
				expect.objectContaining({
					caseWithdrawnDate: expect.any(String)
				}),
				expect.objectContaining({
					caseWithdrawnDate: expect.any(String)
				})
			]
		});
	});

	it('should render the withdrawn appeals view with no data', async () => {
		req.appealsApiClient.getUserAppeals.mockImplementation(() => Promise.resolve([]));

		await get(req, res);

		expect(res.render).toHaveBeenCalledWith(VIEW.YOUR_APPEALS.WITHDRAWN_APPEALS, {
			withdrawnAppeals: []
		});
	});
});
