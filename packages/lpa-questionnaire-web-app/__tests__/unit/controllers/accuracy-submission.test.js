const accuracySubmissionController = require('../../../src/controllers/accuracy-submission');
const { createOrUpdateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { getTaskStatus } = require('../../../src/services/task.service');
const logger = require('../../../src/lib/logger');
const appealReply = require('../emptyAppealReply');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/accuracy-submission', () => {
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

  describe('getAccuracySubmission', () => {
    it('should call the correct template', () => {
      req.session.backLink = `/mock-id/mock-back-link`;

      accuracySubmissionController.getAccuracySubmission(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ACCURACY_SUBMISSION, {
        appeal: null,
        backLink: `/mock-id/mock-back-link`,
        values: {
          'accurate-submission': null,
          'inaccuracy-reason': '',
        },
      });
    });

    it('should call task-list as a default back link if nothing set in session', () => {
      accuracySubmissionController.getAccuracySubmission(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ACCURACY_SUBMISSION, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'accurate-submission': null,
          'inaccuracy-reason': '',
        },
      });
    });

    it('should pass appeal reply data if yes passed', () => {
      mockAppealReply.aboutAppealSection.submissionAccuracy = {
        accurateSubmission: true,
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      accuracySubmissionController.getAccuracySubmission(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ACCURACY_SUBMISSION, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'accurate-submission': 'yes',
          'inaccuracy-reason': undefined,
        },
      });
    });

    it('should pass appeal reply data if no and inaccuracy reason passed', () => {
      mockAppealReply.aboutAppealSection.submissionAccuracy = {
        accurateSubmission: false,
        inaccuracyReason: 'mock reason',
      };

      const mockRequest = {
        ...mockReq(),
        session: {
          appealReply: mockAppealReply,
        },
      };

      accuracySubmissionController.getAccuracySubmission(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ACCURACY_SUBMISSION, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        values: {
          'accurate-submission': 'no',
          'inaccuracy-reason': 'mock reason',
        },
      });
    });
  });

  describe('postAccuracySubmission', () => {
    it('should redirect to the back link specified', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'accurate-submission': 'yes',
        },
      };
      mockRequest.session.backLink = `/mock-id/mock-back-link`;

      await accuracySubmissionController.postAccuracySubmission(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/mock-back-link`);
    });

    it('should redirect with accurate-submission set to yes', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.aboutAppealSection.submissionAccuracy.accurateSubmission = true;
      mockAppealReply.sectionStates.aboutAppealSection.submissionAccuracy = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'accurate-submission': 'yes',
        },
      };

      await accuracySubmissionController.postAccuracySubmission(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should redirect with accurate-submission set to no and appeal-reference-numbers passed', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.aboutAppealSection.submissionAccuracy = {
        accurateSubmission: true,
        inaccuracyReason: 'mock reason',
      };
      mockAppealReply.sectionStates.aboutAppealSection.otherAppeals = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'accurate-submission': 'no',
          'inaccuracy-reason': 'mock reason',
        },
      };
      mockRequest.session.backLink = `/mock-id/${VIEW.TASK_LIST}`;

      await accuracySubmissionController.postAccuracySubmission(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });

    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'accurate-submission': 'no',
          'inaccuracy-reason': null,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await accuracySubmissionController.postAccuracySubmission(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.ACCURACY_SUBMISSION, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
        values: {
          'accurate-submission': 'no',
          'inaccuracy-reason': null,
        },
      });
    });

    it('should re-render the template with an error if there is an API error', async () => {
      getTaskStatus.mockImplementation(() => mockTaskStatus);

      mockAppealReply.aboutAppealSection.submissionAccuracy.accurateSubmission = true;
      mockAppealReply.sectionStates.aboutAppealSection.submissionAccuracy = mockTaskStatus;

      const mockRequest = {
        ...mockReq(),
        body: {
          'accurate-submission': 'yes',
        },
      };

      createOrUpdateAppealReply.mockRejectedValue('mock api error');

      await accuracySubmissionController.postAccuracySubmission(mockRequest, res);

      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(mockAppealReply);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.ACCURACY_SUBMISSION, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        errorSummary: [{ text: 'mock api error' }],
        errors: {},
        values: {
          'accurate-submission': 'yes',
          'inaccuracy-reason': undefined,
        },
      });
    });
  });
});
