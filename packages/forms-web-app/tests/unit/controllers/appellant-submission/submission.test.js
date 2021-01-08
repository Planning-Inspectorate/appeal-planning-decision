const submissionController = require('../../../../src/controllers/appellant-submission/submission');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');

const req = mockReq();
const res = mockRes();

describe('controllers/appellant-submission/submission', () => {
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

    it('should redirect back to /submission if validation passes but `i-agree` not given', async () => {
      const mockRequest = {
        ...req,
        body: {
          'appellant-confirmation': 'anything here - not valid',
        },
      };
      submissionController.postSubmission(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.SUBMISSION}`);
    });

    it('should redirect if valid', async () => {
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
