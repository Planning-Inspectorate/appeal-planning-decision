const developmentPlanController = require('../../../src/controllers/development-plan');
const appealReply = require('../../../src/lib/empty-appeal-reply');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/development-plan', () => {
  const backLinkUrl = '/mock-id/mock-back-link';

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
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
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
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
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
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'has-plan-submitted': 'no',
          'plan-changes-text': undefined,
        },
      });
    });
  });
});
