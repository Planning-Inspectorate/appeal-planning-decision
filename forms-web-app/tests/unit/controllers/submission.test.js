const submissionController = require('../../../src/controllers/submission');
const { mockReq, mockRes } = require('../mocks');
const { VIEW } = require('../../../src/lib/views');

const req = mockReq();
const res = mockRes();

describe('controller/submission', () => {
  describe('getSubmission', () => {
    it('should call the correct template', () => {
      submissionController.getSubmission(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.SUBMISSION);
    });
  });

  describe('postSubmission', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: { a: { msg: 'There were errors here' } },
        },
      };
      await submissionController.postSubmission(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.SUBMISSION, {
        errorSummary: { a: { msg: 'There were errors here' } },
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

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.SUBMISSION}`);
    });

    it('should redirect if valid', async () => {
      const mockRequest = {
        ...req,
        body: {
          'appellant-confirmation': 'i-agree',
        },
      };
      await submissionController.postSubmission(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.CONFIRMATION}`);
    });
  });
});
