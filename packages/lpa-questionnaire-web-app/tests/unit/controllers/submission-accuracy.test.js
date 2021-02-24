const accuracySubmissionController = require('../../../src/controllers/accuracy-submission');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/accuracy-submission', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getAccuracySubmission', () => {
    it('should call the correct template', () => {
      req.session.backLink = `/mock-id/mock-back-link`;

      accuracySubmissionController.getAccuracySubmission(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ACCURACY_SUBMISSION, {
        appeal: null,
        backLink: `/mock-id/mock-back-link`,
      });
    });

    it('should call task-list as a default back link if nothing set in session', () => {
      accuracySubmissionController.getAccuracySubmission(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ACCURACY_SUBMISSION, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
      });
    });
  });

  describe('postAccuracySubmission', () => {
    it('should redirect with accurate-submission set to yes', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'accurate-submission': 'yes',
        },
      };

      await accuracySubmissionController.postAccuracySubmission(mockRequest, res);

      expect(res.render).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/mock-id/${VIEW.TASK_LIST}`);
    });

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

    it('should redirect with adjacent-appeals set to true and appeal-reference-numbers passed', async () => {
      const mockRequest = {
        ...mockReq(),
        body: {
          'accurate-submission': 'no',
          'inaccuracy-reason': 'some reason',
        },
      };
      mockRequest.session.backLink = `/mock-id/${VIEW.TASK_LIST}`;

      await accuracySubmissionController.postAccuracySubmission(mockRequest, res);

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
  });
});
