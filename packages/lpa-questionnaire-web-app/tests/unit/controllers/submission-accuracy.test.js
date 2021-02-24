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
});
