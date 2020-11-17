const submissionController = require('../../../src/controllers/submission');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('controller/submission', () => {
  describe('getSubmission', () => {
    it('should call the correct template', () => {
      submissionController.getSubmission(req, res);

      expect(res.render).toHaveBeenCalledWith('submission/index');
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
      expect(res.render).toHaveBeenCalledWith('submission/index', {
        errorSummary: { a: { msg: 'There were errors here' } },
        errors: { a: 'b' },
      });
    });

    xit('should log an error if the api call fails, and remain on the same page', async () => {});

    xit('should redirect if valid', async () => {});
  });
});
