const { mockReq, mockRes } = require('../../../mocks');

const {
	VIEW: {
		FULL_APPEAL: { LIST_OF_DOCUMENTS, TASK_LIST }
	}
} = require('../../../../../src/lib/views');
const {
	getListOfDocuments,
	postListOfDocuments
} = require('../../../../../src/controllers/full-appeal/submit-appeal/list-of-documents');
const { isFeatureActive } = require('../../../../../src/featureFlag');
const { getDepartmentFromId } = require('../../../../../src/services/department.service');
const { deleteAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const {
	baseS78SubmissionUrl,
	taskListUrl
} = require('../../../../../src/journeys/s78-appeal-form');
const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');

const apiClient = {
	createAppellantSubmission: jest.fn()
};

const mockId = 'mockV1Appeal';
const mockAppealSqlId = 'mockSqlId';
const mockDecisionDate = 'mockDate';
const mockPlanningApplicationNumber = 'mockPAnumber';
const mockEligibility = {
	applicationDecision: 'mockDecision'
};

const mockAppeal = {
	id: mockId,
	appealSqlId: mockAppealSqlId,
	decisionDate: mockDecisionDate,
	planningApplicationNumber: mockPlanningApplicationNumber,
	eligibility: mockEligibility
};

jest.mock('../../../../../src/featureFlag');
jest.mock('../../../../../src/services/department.service');
jest.mock('../../../../../src/lib/appeals-api-wrapper');

describe('controllers/full-appeal/submit-appeal/list-of-documents', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getListOfDocuments', () => {
		it('should call the correct template', async () => {
			getDepartmentFromId.mockResolvedValue({ lpaCode: 'testCode' });
			isFeatureActive.mockResolvedValue(false);

			await getListOfDocuments(req, res);

			expect(res.render).toHaveBeenCalledWith(LIST_OF_DOCUMENTS, { usingV2Form: false });
		});
	});

	describe('postListOfDocuments', () => {
		it('for v1 appeals - should redirect to `/full-appeal/submit-appeal/task-list`', async () => {
			getDepartmentFromId.mockResolvedValue({ lpaCode: 'testCode' });
			isFeatureActive.mockResolvedValue(false);

			req.body = {};
			await postListOfDocuments(req, res);
			expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
		});

		it('for v2 appeals - should create an appellantSubmission and redirect to v2 task list', async () => {
			getDepartmentFromId.mockResolvedValue({ lpaCode: 'testLPACode' });
			isFeatureActive.mockResolvedValue(true);
			apiClient.createAppellantSubmission.mockResolvedValue({ id: 'testId' });

			req.body = {};
			req.session.appeal = mockAppeal;
			req.appealsApiClient = apiClient;

			await postListOfDocuments(req, res);
			expect(apiClient.createAppellantSubmission).toHaveBeenCalledWith({
				appealId: mockAppealSqlId,
				LPACode: 'testLPACode',
				appealTypeCode: APPEALS_CASE_DATA.APPEAL_TYPE_CODE.S78,
				applicationDecisionDate: mockDecisionDate,
				applicationReference: mockPlanningApplicationNumber,
				applicationDecision: mockEligibility.applicationDecision
			});
			expect(deleteAppeal).toHaveBeenCalledWith(mockId);
			expect(res.redirect).toHaveBeenCalledWith(`${baseS78SubmissionUrl}/${taskListUrl}?id=testId`);
		});
	});
});
