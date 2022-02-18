const appeal = require('@pins/business-rules/test/data/full-appeal');
const declarationController = require('../../../../../src/controllers/full-appeal/submit-appeal/declaration');
const { submitAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { storePdfAppeal } = require('../../../../../src/services/pdf.service');
const { mockReq, mockRes } = require('../../../mocks');
const { VIEW } = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/services/pdf.service');
jest.mock('../../../../../src/lib/appeals-api-wrapper');

describe('controllers/full-appeal/submit-appeal/declaration', () => {
  let req;
  let res;

  const appealPdf = {
    id: 'id',
    name: 'appeal.pdf',
    location: 'here',
    size: '123',
  };

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getDeclaration', () => {
    it('should call the correct template', () => {
      declarationController.getDeclaration(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.DECLARATION);
    });
  });

  describe('postDeclaration', () => {
    it('should re-render the template with errors if there is any appeals api call error', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };

      mockRequest.session.appeal.decisionDate = new Date().toISOString();

      storePdfAppeal.mockResolvedValue(appealPdf);

      const error = new Error('Cheers');
      submitAppeal.mockImplementation(() => Promise.reject(error));

      await declarationController.postDeclaration(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(storePdfAppeal).toHaveBeenCalledWith(appeal);

      expect(submitAppeal).toHaveBeenCalledWith({
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

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.DECLARATION, {
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should re-render the template with errors if there is any pdf api call error', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };

      mockRequest.session.appeal.decisionDate = new Date().toISOString();

      const error = new Error('Cheers');
      storePdfAppeal.mockImplementation(() => Promise.reject(error));

      await declarationController.postDeclaration(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(submitAppeal).not.toHaveBeenCalled();

      expect(storePdfAppeal).toHaveBeenCalledWith(appeal);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.DECLARATION, {
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect if valid', async () => {
      storePdfAppeal.mockResolvedValue(appealPdf);

      const decisionDate = new Date();
      const mockRequest = {
        ...req,
        body: {},
      };

      req.session.appeal.decisionDate = decisionDate;

      await declarationController.postDeclaration(mockRequest, res);

      expect(submitAppeal).toHaveBeenCalledWith({
        ...appeal,
        decisionDate,
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

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_APPEAL.APPEAL_SUBMITTED}`);
    });
  });
});
