const developmentPlanController = require('../../../src/controllers/development-plan');
const { createOrUpdateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { getTaskStatus } = require('../../../src/services/task.service');
const logger = require('../../../src/lib/logger');
const appealReply = require('../emptyAppealReply');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/development-plan', () => {
  const backLinkUrl = '/appeal-questionnaire/mock-id/mock-back-link';
  const mockTaskStatus = 'MOCK_STATUS';
  let req;
  let res;
  let mockAppealReply;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    mockAppealReply = { ...appealReply };

    jest.resetAllMocks();
  });

  describe('getDevelopmentPlan', () => {
    const values = {
      'has-plan-submitted': null,
      'plan-changes-text': '',
    };

    it('should call the correct template', () => {
      req.session.backLink = backLinkUrl;
      developmentPlanController.getDevelopmentPlan(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.DEVELOPMENT_PLAN, {
        appeal: null,
        backLink: backLinkUrl,
        values,
      });
    });

    it('it should have the correct backlink when no request session object exists.', () => {
      developmentPlanController.getDevelopmentPlan(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.DEVELOPMENT_PLAN, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        values,
      });
    });

    it('should pass the development plan data if yes and text passes', () => {
      mockAppealReply.optionalDocumentsSection.developmentOrNeighbourhood = {
        hasPlanSubmitted: true,
        planChanges: 'some-text',
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      developmentPlanController.getDevelopmentPlan(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.DEVELOPMENT_PLAN, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'has-plan-submitted': 'yes',
          'plan-changes-text': 'some-text',
        },
      });
    });

    it('should pass the development plan data if no passed', () => {
      mockAppealReply.optionalDocumentsSection.developmentOrNeighbourhood = {
        hasPlanSubmitted: false,
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      developmentPlanController.getDevelopmentPlan(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.DEVELOPMENT_PLAN, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'has-plan-submitted': 'no',
          'plan-changes-text': undefined,
        },
      });
    });
  });

  describe('postDevelopmentPlan', () => {
    it('should redirect with has-plan-submitted set to false', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.optionalDocumentsSection.developmentOrNeighbourhood.hasPlanSubmitted = false;

      const mockRequest = {
        ...mockReq(),
        body: {
          'has-plan-submitted': 'no',
        },
      };

      await developmentPlanController.postDevelopmentPlan(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should redirect to the back link specified', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.optionalDocumentsSection.developmentOrNeighbourhood.hasPlanSubmitted = false;

      const mockRequest = {
        ...mockReq(),
        body: {
          'has-plan-submitted': 'no',
        },
      };
      mockRequest.session.backLink = '/appeal-questionnaire/mock-id/task-listw';
      await developmentPlanController.postDevelopmentPlan(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith('/appeal-questionnaire/mock-id/task-list');
    });

    it('should redirect with has-plan-submitted set to true and plan-changes-text passed', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.optionalDocumentsSection.developmentOrNeighbourhood = {
        hasPlanSubmitted: true,
        planChanges: 'some-text',
      };
      mockAppealReply.optionalDocumentsSection.developmentOrNeighbourhood.planChanges =
        mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'has-plan-submitted': 'yes',
          'plan-changes-text': 'some-text',
        },
      };
      mockRequest.session.backLink = `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`;

      await developmentPlanController.postDevelopmentPlan(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'has-plan-submitted': 'yes',
          'plan-changes-text': null,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await developmentPlanController.postDevelopmentPlan(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.DEVELOPMENT_PLAN, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        values: {
          'has-plan-submitted': 'yes',
          'plan-changes-text': null,
        },
      });
    });

    it('should re-render the template with an error if there is an API error', async () => {
      mockAppealReply.optionalDocumentsSection.developmentOrNeighbourhood.hasPlanSubmitted = false;
      mockAppealReply.sectionStates.planChanges = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'has-plan-submitted': 'no',
        },
      };

      createOrUpdateAppealReply.mockRejectedValue('mock api error');

      await developmentPlanController.postDevelopmentPlan(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.DEVELOPMENT_PLAN, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'mock api error' }],
        errors: {},
        values: {
          'has-plan-submitted': 'no',
          'plan-changes-text': undefined,
        },
      });
    });
  });
});
