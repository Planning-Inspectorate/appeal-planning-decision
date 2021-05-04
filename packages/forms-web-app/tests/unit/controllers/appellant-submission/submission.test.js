const submissionController = require('../../../../src/controllers/appellant-submission/submission');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { storePdfAppeal } = require('../../../../src/services/pdf.service');

const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

jest.mock('../../../../src/services/pdf.service');
jest.mock('../../../../src/lib/appeals-api-wrapper');

describe('controllers/appellant-submission/submission', () => {
  let req;
  let res;
  let appeal;

  const appealPdf = {
    id: 'id',
    name: 'appeal.pdf',
    location: 'here',
    size: '123',
  };

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    ({ empty: appeal } = APPEAL_DOCUMENT);
    appeal.yourAppealSection.otherDocuments.uploadedFiles = [];

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

    it('should re-render the template with errors if there is any appeals api call error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'appellant-confirmation': 'i-agree',
        },
      };

      storePdfAppeal.mockResolvedValue(appealPdf);

      const error = new Error('Cheers');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await submissionController.postSubmission(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(storePdfAppeal).toHaveBeenCalledWith(appeal);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        appealSubmission: {
          appealPDFStatement: {
            uploadedFile: {
              ...appealPdf,
              fileName: appealPdf.name,
              originalFileName: appealPdf.name,
            },
          },
        },
        state: 'SUBMITTED',
      });

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should re-render the template with errors if there is any pdf api call error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'appellant-confirmation': 'i-agree',
        },
      };

      const error = new Error('Cheers');
      storePdfAppeal.mockImplementation(() => Promise.reject(error));

      await submissionController.postSubmission(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(storePdfAppeal).toHaveBeenCalledWith(appeal);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
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
      storePdfAppeal.mockResolvedValue(appealPdf);

      const mockRequest = {
        ...req,
        body: {
          'appellant-confirmation': 'i-agree',
        },
      };
      await submissionController.postSubmission(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        appealSubmission: {
          appealPDFStatement: {
            uploadedFile: {
              ...appealPdf,
              fileName: appealPdf.name,
              originalFileName: appealPdf.name,
            },
          },
        },
        state: 'SUBMITTED',
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.CONFIRMATION}`);
    });
  });
});
