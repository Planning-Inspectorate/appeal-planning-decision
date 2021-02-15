const submissionController = require('../../../../src/controllers/appellant-submission/submission');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/appellant-submission/submission', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getSubmission', () => {
    it('should call the correct template', () => {
      submissionController.getSubmission(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUBMISSION);
    });
  });

  describe('postSubmission', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await submissionController.postSubmission(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
      });
    });

    it(`should redirect back to /${VIEW.APPELLANT_SUBMISSION.SUBMISSION} if validation passes but 'i-agree' not given`, async () => {
      const mockRequest = {
        ...req,
        body: {
          'appellant-confirmation': 'anything here - not valid',
        },
      };
      submissionController.postSubmission(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.SUBMISSION}`);
    });

    it('should re-render the template with errors if the createOrUpdateAppeal API call fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          'appellant-confirmation': 'i-agree',
        },
      };

      const error = new Error('There were errors here');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await submissionController.postSubmission(mockRequest, res);

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
        appeal,
        errorSummary: [{ text: error.toString(), href: '#' }],
        errors: {},
      });
    });

    it(`should redirect to /${VIEW.APPELLANT_SUBMISSION.CONFIRMATION} if valid`, async () => {
      const mockRequest = {
        ...req,
        body: {
          'appellant-confirmation': 'i-agree',
        },
      };
      await submissionController.postSubmission(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.CONFIRMATION}`);
    });
  });
});
