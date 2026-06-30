const { getCaseFixture } = require('@pins/common/__tests__/fixtures/appeal-cases.fixture.js');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_PROCEDURE,
	APPEAL_CASE_DECISION_OUTCOME,
	APPEAL_CASE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');

const { get } = require('../../../../src/controllers/appeals/your-appeals');

const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/featureFlag');
const { isFeatureActive } = require('../../../../src/featureFlag');

const now = new Date();
const monthAgo = new Date(now.setMonth(now.getMonth() - 1));

const mockAppealData = [
	// final comments submitted, show in waiting for review appeals
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.FINAL_COMMENTS,
			APPEAL_CASE_PROCEDURE.WRITTEN
		),
		finalCommentsDueDate: new Date(),
		appellantCommentsSubmittedDate: new Date()
	},
	// final comments due show in todo appeals
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.FINAL_COMMENTS,
			APPEAL_CASE_PROCEDURE.WRITTEN
		),
		finalCommentsDueDate: new Date()
	},
	// validated invalid, show in todo appeals as invalid
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.INVALID,
			APPEAL_CASE_PROCEDURE.WRITTEN
		).setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID),
		finalCommentsDueDate: new Date()
	},
	// old invalid - counted with withdrawn
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.INVALID,
			APPEAL_CASE_PROCEDURE.WRITTEN
		).setValidationOutcome(APPEAL_CASE_VALIDATION_OUTCOME.INVALID, monthAgo),
		finalCommentsDueDate: monthAgo
	},
	// decided allowed
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.COMPLETE,
			APPEAL_CASE_PROCEDURE.WRITTEN
		).setDecisionOutcome(APPEAL_CASE_DECISION_OUTCOME.ALLOWED, true)
	},
	// decided invalid
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.INVALID,
			APPEAL_CASE_PROCEDURE.WRITTEN
		).setDecisionOutcome(APPEAL_CASE_DECISION_OUTCOME.INVALID, true),
		caseValidationOutcome: APPEAL_CASE_VALIDATION_OUTCOME.VALID
	},
	// withdrawn
	{
		...getCaseFixture(
			CASE_TYPES.HAS.processCode,
			APPEAL_CASE_STATUS.WITHDRAWN,
			APPEAL_CASE_PROCEDURE.WRITTEN
		).markAsWithdrawn()
	},
	// v2 draft
	{
		id: 'abc',
		AppellantSubmission: {
			submitted: false,
			appealTypeCode: 'HAS',
			applicationDecisionDate: new Date(),
			applicationDecision: 'refused',
			siteAddress: null,
			SubmissionAddress: null,
			enforcementEffectiveDate: null,
			hasContactedPlanningInspectorate: null,
			isListedBuilding: false
		}
	},
	// v2 submitted draft
	{
		id: 'abc123',
		AppellantSubmission: {
			submitted: true,
			appealTypeCode: 'HAS',
			applicationDecisionDate: new Date(),
			applicationDecision: 'refused',
			siteAddress: null,
			SubmissionAddress: null,
			enforcementEffectiveDate: null,
			hasContactedPlanningInspectorate: null,
			isListedBuilding: false
		}
	}
];

describe('controllers/appeals/your-appeals', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();

		req.appealsApiClient = {
			getUserAppeals: jest.fn()
		};
	});

	describe('Get - Your appeals', () => {
		it('should render the view with correct counts and appeals', async () => {
			req.appealsApiClient.getUserAppeals.mockResolvedValue(mockAppealData);
			isFeatureActive.mockResolvedValueOnce(true);

			await get(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.APPEALS.YOUR_APPEALS, {
				toDoAppeals: [
					expect.objectContaining({
						appealId: expect.any(String),
						appealNumber: expect.any(String),
						appealType: expect.any(String),
						nextJourneyDue: {
							deadline: null,
							dueInDays: -100000,
							journeyDue: 'Invalid'
						},
						isDraft: false,
						displayInvalid: true,
						displayNextJourneyLink: true
					}),
					expect.objectContaining({
						appealId: expect.any(String),
						appealNumber: expect.any(String),
						appealType: expect.any(String),
						nextJourneyDue: {
							baseUrl: expect.stringContaining('/appeals/final-comments/'),
							deadline: expect.any(Date),
							dueInDays: 0,
							journeyDue: 'Final comments'
						},
						isDraft: false,
						displayInvalid: false,
						displayNextJourneyLink: true
					}),
					expect.objectContaining({
						nextJourneyDue: {
							deadline: expect.any(Date),
							dueInDays: expect.any(Number),
							journeyDue: 'Continue'
						},
						isDraft: true,
						displayInvalid: false,
						displayNextJourneyLink: true
					})
				],
				waitingForReviewAppeals: [
					expect.objectContaining({
						appealNumber: mockAppealData[0].caseReference,
						displayInvalid: false,
						displayNextJourneyLink: true,
						nextJourneyDue: {
							baseUrl: null,
							deadline: null,
							dueInDays: 100000,
							journeyDue: null
						}
					})
				],
				noToDoAppeals: false,
				decidedAppealsLink: `/${VIEW.YOUR_APPEALS.DECIDED_APPEALS}`,
				decidedAppealsCount: 2,
				withdrawnAppealsCount: 2,
				withdrawnAppealsLink: `/${VIEW.YOUR_APPEALS.WITHDRAWN_APPEALS}`
			});
		});

		it('should render the view when no appeals', async () => {
			req.appealsApiClient.getUserAppeals.mockResolvedValue([]);
			isFeatureActive.mockResolvedValueOnce(true);

			await get(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPEALS.NO_APPEALS}`);
		});
	});
});
