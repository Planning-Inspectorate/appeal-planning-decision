const extraConditionsController = require('../../../src/controllers/extra-conditions');
const { createOrUpdateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { getTaskStatus } = require('../../../src/services/task.service');
const logger = require('../../../src/lib/logger');
const appealReply = require('../emptyAppealReply');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/extra-conditions', () => {
  const mockTaskStatus = 'MOCK_STATUS';
  const backLinkUrl = '/appeal-questionnaire/mock-id/mock-back-link';

  let req;
  let res;
  let mockAppealReply;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    mockAppealReply = { ...appealReply };

    jest.resetAllMocks();
  });

  describe('getExtraConditions', () => {
    const values = {
      'has-extra-conditions': null,
      'extra-conditions-text': '',
    };

    it('should call the correct template', () => {
      req.session.backLink = backLinkUrl;
      extraConditionsController.getExtraConditions(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.EXTRA_CONDITIONS, {
        appeal: null,
        backLink: backLinkUrl,
        values,
      });
    });

    it('it should have the correct backlink when no request session object exists.', () => {
      extraConditionsController.getExtraConditions(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.EXTRA_CONDITIONS, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        values,
      });
    });

    it('should pass the extra conditions data if yes and text passes', () => {
      mockAppealReply.aboutAppealSection.extraConditions = {
        hasExtraConditions: true,
        extraConditions: 'some-text',
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      extraConditionsController.getExtraConditions(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.EXTRA_CONDITIONS, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'has-extra-conditions': 'yes',
          'extra-conditions-text': 'some-text',
        },
      });
    });

    it('should pass the extra conditions data if no passed', () => {
      mockAppealReply.aboutAppealSection.extraConditions = {
        hasExtraConditions: false,
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      extraConditionsController.getExtraConditions(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.EXTRA_CONDITIONS, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'has-extra-conditions': 'no',
          'extra-conditions-text': undefined,
        },
      });
    });
  });

  describe('postExtraConditions', () => {
    it('should redirect with extra-conditions set to false', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.aboutAppealSection.extraConditions.hasExtraConditions = false;

      const mockRequest = {
        ...mockReq(),
        body: {
          'extra-conditions': 'no',
        },
      };

      await extraConditionsController.postExtraConditions(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should redirect to the back link specified', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.aboutAppealSection.extraConditions.hasExtraConditions = false;

      const mockRequest = {
        ...mockReq(),
        body: {
          'has-extra-conditions': 'no',
        },
      };
      mockRequest.session.backLink = '/appeal-questionnaire/mock-id/task-list';

      await extraConditionsController.postExtraConditions(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith('/appeal-questionnaire/mock-id/task-list');
    });

    it('should redirect with extra-conditions set to true and extra-conditions-text passed', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.aboutAppealSection.extraConditions = {
        hasExtraConditions: true,
        extraConditions: 'some-text',
      };
      mockAppealReply.aboutAppealSection.extraConditions.extraConditions = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'has-extra-conditions': 'yes',
          'extra-conditions-text': 'some-text',
        },
      };

      await extraConditionsController.postExtraConditions(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'has-extra-conditions': 'yes',
          'extra-conditions-text': null,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await extraConditionsController.postExtraConditions(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.EXTRA_CONDITIONS, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        values: {
          'has-extra-conditions': 'yes',
          'extra-conditions-text': null,
        },
      });
    });

    it('should re-render the template with an error if there is an API error', async () => {
      mockAppealReply.aboutAppealSection.extraConditions.hasExtraConditions = false;
      mockAppealReply.sectionStates.extraConditions = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'has-extra-conditions': 'no',
        },
      };

      createOrUpdateAppealReply.mockRejectedValue('mock api error');

      await extraConditionsController.postExtraConditions(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.EXTRA_CONDITIONS, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'mock api error' }],
        errors: {},
        values: {
          'has-extra-conditions': 'no',
          'extra-conditions-text': undefined,
        },
      });
    });
  });
});
