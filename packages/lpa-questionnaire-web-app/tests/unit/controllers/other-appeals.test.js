const otherAppealsController = require('../../../src/controllers/other-appeals');
const { createOrUpdateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { getTaskStatus } = require('../../../src/services/task.service');
const logger = require('../../../src/lib/logger');
const appealReply = require('../emptyAppealReply');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/other-appeals', () => {
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

  describe('getOtherAppeals', () => {
    it('should call the correct template', () => {
      req.session.backLink = `/mock-id/mock-back-link`;

      otherAppealsController.getOtherAppeals(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.OTHER_APPEALS, {
        appeal: null,
        backLink: `/mock-id/mock-back-link`,
        values: {
          'adjacent-appeals': null,
          'appeal-reference-numbers': '',
        },
      });
    });

    it('should pass the appeal reply data if yes and text passes', () => {
      mockAppealReply.aboutAppealSection.otherAppeals = {
        adjacentAppeals: true,
        appealReferenceNumbers: 'abc-123',
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      otherAppealsController.getOtherAppeals(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.OTHER_APPEALS, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'adjacent-appeals': 'yes',
          'appeal-reference-numbers': 'abc-123',
        },
      });
    });

    it('should pass the appeal reply data if no passed', () => {
      mockAppealReply.aboutAppealSection.otherAppeals = {
        adjacentAppeals: false,
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      otherAppealsController.getOtherAppeals(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.OTHER_APPEALS, {
        appeal: null,
        backLink: `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'adjacent-appeals': 'no',
          'appeal-reference-numbers': undefined,
        },
      });
    });
  });

  describe('postOtherAppeals', () => {
    it('should redirect with adjacent-appeals set to false', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.aboutAppealSection.otherAppeals.adjacentAppeals = false;
      mockAppealReply.sectionStates.aboutAppealSection.otherAppeals = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'adjacent-appeals': 'no',
        },
      };

      await otherAppealsController.postOtherAppeals(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should redirect to the back link specified', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.aboutAppealSection.otherAppeals.adjacentAppeals = false;
      mockAppealReply.sectionStates.aboutAppealSection.otherAppeals = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'adjacent-appeals': 'no',
        },
      };
      mockRequest.session.backLink = `/mock-id/mock-back-link`;

      await otherAppealsController.postOtherAppeals(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/mock-back-link`);
    });

    it('should redirect with adjacent-appeals set to true and appeal-reference-numbers passed', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.aboutAppealSection.otherAppeals = {
        adjacentAppeals: true,
        appealReferenceNumbers: 'some-reference',
      };
      mockAppealReply.sectionStates.aboutAppealSection.otherAppeals = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'adjacent-appeals': 'yes',
          'appeal-reference-numbers': 'some-reference',
        },
      };
      mockRequest.session.backLink = `/mock-id/${VIEW.TASK_LIST}`;

      await otherAppealsController.postOtherAppeals(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'adjacent-appeals': 'yes',
          'appeal-reference-numbers': null,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await otherAppealsController.postOtherAppeals(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.OTHER_APPEALS, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        values: {
          'adjacent-appeals': 'yes',
          'appeal-reference-numbers': null,
        },
      });
    });

    it('should re-render the template with an error if there is an API error', async () => {
      mockAppealReply.aboutAppealSection.otherAppeals.adjacentAppeals = false;
      mockAppealReply.sectionStates.aboutAppealSection.otherAppeals = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'adjacent-appeals': 'no',
        },
      };

      createOrUpdateAppealReply.mockRejectedValue('mock api error');

      await otherAppealsController.postOtherAppeals(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.OTHER_APPEALS, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'mock api error' }],
        errors: {},
        values: {
          'adjacent-appeals': 'no',
          'appeal-reference-numbers': undefined,
        },
      });
    });
  });
});
