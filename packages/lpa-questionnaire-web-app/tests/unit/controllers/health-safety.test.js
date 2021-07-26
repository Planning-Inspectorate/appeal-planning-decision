const healthSafetyController = require('../../../src/controllers/health-safety');
const { createOrUpdateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { getTaskStatus } = require('../../../src/services/task.service');
const logger = require('../../../src/lib/logger');
const appealReply = require('../emptyAppealReply');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/health-safety', () => {
  const mockTaskStatus = 'MOCK_STATUS';
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

  describe('getHealthSafety', () => {
    const values = {
      'has-health-safety': null,
      'health-safety-text': '',
    };

    it('should call the correct template', () => {
      req.session.backLink = backLinkUrl;
      healthSafetyController.getHealthSafety(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.HEALTH_SAFETY, {
        appeal: null,
        backLink: backLinkUrl,
        values,
      });
    });

    it('it should have the correct backlink when no request session object exists.', () => {
      healthSafetyController.getHealthSafety(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.HEALTH_SAFETY, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        values,
      });
    });

    it('should pass the health and safety data if yes and text passes', () => {
      mockAppealReply.healthSafety = {
        hasHealthSafety: true,
        healthSafetyIssues: 'some-text',
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      healthSafetyController.getHealthSafety(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.HEALTH_SAFETY, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'has-health-safety': 'yes',
          'health-safety-text': 'some-text',
        },
      });
    });

    it('should pass the health and safety data if no passed', () => {
      mockAppealReply.healthSafety = {
        hasHealthSafety: false,
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      healthSafetyController.getHealthSafety(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.HEALTH_SAFETY, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'has-health-safety': 'no',
          'health-safety-text': undefined,
        },
      });
    });
  });

  describe('postHealthSafety', () => {
    it('should redirect with health-safety set to false', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.healthSafety.hasHealthSafety = false;

      const mockRequest = {
        ...mockReq(),
        body: {
          'health-safety': 'no',
        },
      };

      await healthSafetyController.postHealthSafety(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should redirect to the back link specified', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.healthSafety.hasHealthSafety = false;

      const mockRequest = {
        ...mockReq(),
        body: {
          'has-health-safety': 'no',
        },
      };
      mockRequest.session.backLink = backLinkUrl;

      await healthSafetyController.postHealthSafety(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(backLinkUrl);
    });

    it('should redirect with has-health-safety set to true and health-safety-text passed', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.healthSafety = {
        hasHealthSafety: true,
        healthSafetyIssues: 'some-text',
      };

      const mockRequest = {
        ...mockReq(),
        body: {
          'has-health-safety': 'yes',
          'health-safety-text': 'some-text',
        },
      };
      mockRequest.session.backLink = `/mock-id/${VIEW.TASK_LIST}`;

      await healthSafetyController.postHealthSafety(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'has-health-safety': 'yes',
          'health-safety-text': null,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await healthSafetyController.postHealthSafety(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.HEALTH_SAFETY, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        values: {
          'has-health-safety': 'yes',
          'health-safety-text': null,
        },
      });
    });

    it('should re-render the template with an error if there is an API error', async () => {
      mockAppealReply.healthSafety.hasHealthSafety = false;
      mockAppealReply.sectionStates.healthSafety = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'has-health-safety': 'no',
        },
      };

      createOrUpdateAppealReply.mockRejectedValue('mock api error');

      await healthSafetyController.postHealthSafety(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.HEALTH_SAFETY, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'mock api error' }],
        errors: {},
        values: {
          'has-health-safety': 'no',
          'health-safety-text': undefined,
        },
      });
    });
  });
});
