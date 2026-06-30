const { getCaseFixture } = require('@pins/common/__tests__/fixtures/appeal-cases.fixture.js');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');

const { getYourAppeals } = require('../../../../src/controllers/lpa-dashboard/your-appeals');
const { getUserFromSession } = require('../../../../src/services/user.service');

const { VIEW } = require('../../../../src/lib/views');
const { baseHASUrl } = require('../../../../src/dynamic-forms/has-questionnaire/journey');

const { mockReq, mockRes } = require('../../mocks');
const { isFeatureActive } = require('../../../../src/featureFlag');

jest.mock('../../../../src/services/user.service');
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

const now = new Date();
const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
const mockAppealData = [
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			APPEAL_CASE_PROCEDURE.WRITTEN
		),
		lpaQuestionnaireDueDate: new Date(),
		lpaQuestionnaireSubmittedDate: new Date()
	},
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			APPEAL_CASE_PROCEDURE.WRITTEN
		),
		lpaQuestionnaireDueDate: new Date()
	},
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.INVALID,
			APPEAL_CASE_PROCEDURE.WRITTEN
		).setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID),
		lpaQuestionnaireDueDate: new Date()
	},
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.INVALID,
			APPEAL_CASE_PROCEDURE.WRITTEN
		).setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID, monthAgo),
		lpaQuestionnaireDueDate: monthAgo
	},
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.WITHDRAWN,
			APPEAL_CASE_PROCEDURE.WRITTEN
		).markAsWithdrawn()
	}
];

const mockDecidedCount = {
	count: 1
};

describe('controllers/lpa-dashboard/your-appeals', () => {
	beforeEach(() => {
		req.appealsApiClient = {
			getAppealsCaseDataV2: jest.fn(),
			getAppealsCasesByLpaAndStatus: jest.fn(),
			getDecidedAppealsCountV2: jest.fn()
		};

		jest.resetAllMocks();
	});

	describe('getYourAppeals', () => {
		it('should render the view with correct counts and appeals', async () => {
			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getAppealsCaseDataV2.mockResolvedValue(mockAppealData);
			req.appealsApiClient.getDecidedAppealsCountV2.mockResolvedValue(mockDecidedCount);
			isFeatureActive.mockResolvedValueOnce(true);

			await getYourAppeals(req, res);

			expect(getUserFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.DASHBOARD, {
				lpaName: mockUser.lpaName,
				addOrRemoveLink: `/${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}`,
				toDoAppeals: [
					expect.objectContaining({
						isNewAppeal: false,
						displayInvalid: true,
						displayNextJourneyLink: true,
						nextJourneyDue: {
							deadline: null,
							dueInDays: -100000,
							journeyDue: null
						}
					}),
					expect.objectContaining({
						isNewAppeal: false,
						displayInvalid: false,
						displayNextJourneyLink: true,
						nextJourneyDue: {
							baseUrl: expect.stringContaining('/manage-appeals/questionnaire/'),
							deadline: expect.any(Date),
							dueInDays: 0,
							journeyDue: 'Questionnaire'
						}
					})
				],
				waitingForReviewAppeals: [
					expect.objectContaining({
						displayInvalid: false,
						displayNextJourneyLink: true,
						isNewAppeal: false,
						nextJourneyDue: {
							baseUrl: null,
							deadline: null,
							dueInDays: 100000,
							journeyDue: null
						}
					})
				],
				appealQuestionnaireLink: baseHASUrl,
				decidedAppealsLink: `/${VIEW.LPA_DASHBOARD.DECIDED_APPEALS}`,
				decidedAppealsCount: 1,
				noToDoAppeals: false,
				withdrawnAppealsCount: 2,
				withdrawnAppealsLink: `/${VIEW.LPA_DASHBOARD.WITHDRAWN_APPEALS}`
			});
		});

		it('should render the view when no appeals', async () => {
			getUserFromSession.mockReturnValue(mockUser);
			req.appealsApiClient.getAppealsCaseDataV2.mockResolvedValue([]);
			req.appealsApiClient.getDecidedAppealsCountV2.mockResolvedValue({
				count: 0
			});
			isFeatureActive.mockResolvedValueOnce(true);

			await getYourAppeals(req, res);

			expect(getUserFromSession).toHaveBeenCalledWith(req);
			expect(res.render).toHaveBeenCalledWith(VIEW.LPA_DASHBOARD.DASHBOARD, {
				lpaName: mockUser.lpaName,
				addOrRemoveLink: `/${VIEW.LPA_DASHBOARD.ADD_REMOVE_USERS}`,
				toDoAppeals: [],
				waitingForReviewAppeals: [],
				appealQuestionnaireLink: baseHASUrl,
				decidedAppealsLink: `/${VIEW.LPA_DASHBOARD.DECIDED_APPEALS}`,
				decidedAppealsCount: 0,
				noToDoAppeals: true,
				withdrawnAppealsCount: 0,
				withdrawnAppealsLink: `/${VIEW.LPA_DASHBOARD.WITHDRAWN_APPEALS}`
			});
		});
	});
});
