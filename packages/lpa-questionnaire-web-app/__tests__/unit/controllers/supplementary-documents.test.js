const supplementaryDocumentsController = require('../../../src/controllers/supplementary-documents');
const { VIEW } = require('../../../src/lib/views');
const { uploadFiles } = require('../../../src/lib/file-upload-helpers');
const { createOrUpdateAppealReply } = require('../../../src/lib/appeal-reply-api-wrapper');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/lib/file-upload-helpers');
jest.mock('../../../src/lib/logger');

describe('controllers/accuracy-submission', () => {
  let req;
  let res;
  const mockAppealReply = {
    id: 'mock-id',
    optionalDocumentsSection: {
      supplementaryPlanningDocuments: { uploadedFiles: [] },
    },
  };

  beforeEach(() => {
    req = mockReq(mockAppealReply);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getAddDocument', () => {
    it('should call the correct template', () => {
      req.session.backLink = '/mock-id/mock-back-link';

      supplementaryDocumentsController.getAddDocument(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT, {
        appeal: null,
        backLink: '/mock-id/mock-back-link',
        question: supplementaryDocumentsController.question,
      });
    });

    it('should call task-list as a default back link if nothing set in session', () => {
      supplementaryDocumentsController.getAddDocument(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        question: supplementaryDocumentsController.question,
      });
    });

    it('should call back link from locals as priority if provided', () => {
      req.session.backLink = '/mock-id/mock-back-link';
      res.locals.backLink = '/some/other/backlink';

      supplementaryDocumentsController.getAddDocument(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT, {
        appeal: null,
        backLink: '/some/other/backlink',
        question: supplementaryDocumentsController.question,
      });
    });
  });

  describe('postAddDocument', () => {
    const emptyValues = {
      'adoptedDate-day': undefined,
      'adoptedDate-month': undefined,
      'adoptedDate-year': undefined,
      documentName: undefined,
      documents: undefined,
      formallyAdopted: undefined,
      stageReached: undefined,
    };

    let mockError;
    let mockErrorSummary;

    beforeEach(() => {
      mockError = {
        mockError: {
          msg: 'some-error',
        },
      };

      mockErrorSummary = [{ href: '#mock', text: 'some-error' }];

      jest.resetAllMocks();
    });

    it('should reload the page showing errors if there are any', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: mockError,
          errorSummary: mockErrorSummary,
        },
      };

      await supplementaryDocumentsController.postAddDocument(mockRequest, res);

      expect(uploadFiles).not.toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        question: supplementaryDocumentsController.question,
        errors: mockError,
        errorSummary: mockErrorSummary,
        values: emptyValues,
      });
    });
    it('should transform document errors', async () => {
      mockError = {
        'files.documents[0]': {
          msg: 'some-error',
        },
      };
      mockErrorSummary = [{ href: '#files.documents[0]', text: 'some-error' }];

      const mockRequest = {
        ...req,
        body: {
          errors: mockError,
          errorSummary: mockErrorSummary,
        },
      };

      await supplementaryDocumentsController.postAddDocument(mockRequest, res);

      expect(uploadFiles).not.toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        question: supplementaryDocumentsController.question,
        errors: { documents: { msg: 'some-error' } },
        errorSummary: [{ href: '#documents', text: 'some-error' }],
        values: emptyValues,
      });
    });
    it('should transform date errors', async () => {
      mockErrorSummary = [{ href: '#adoptedDate', text: 'some-error' }];

      const mockRequest = {
        ...req,
        body: {
          errors: mockError,
          errorSummary: mockErrorSummary,
        },
      };

      await supplementaryDocumentsController.postAddDocument(mockRequest, res);

      expect(uploadFiles).not.toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        question: supplementaryDocumentsController.question,
        errors: mockError,
        errorSummary: [{ href: '#adoptedDate-day', text: 'some-error' }],
        values: emptyValues,
      });
    });

    it('should reload the page if there is an api error', async () => {
      uploadFiles.mockRejectedValue('mock-api-error');

      const mockRequest = {
        ...req,
        body: {
          files: {
            documents: [{ name: 'some-file' }],
          },
        },
      };

      await supplementaryDocumentsController.postAddDocument(mockRequest, res);

      expect(uploadFiles).toHaveBeenCalledWith([{ name: 'some-file' }], 'mock-id');
      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        question: supplementaryDocumentsController.question,
        errors: {},
        errorSummary: [{ text: 'mock-api-error' }],
        values: emptyValues,
      });
    });

    it('should redirect to list page if everything is valid', async () => {
      uploadFiles.mockReturnValue([{ id: 'mock-file-id', name: 'some-file.pdf' }]);

      const mockRequest = {
        ...req,
        body: {
          files: {
            documents: [{ name: 'some-file' }],
          },
          documentName: 'Mock Document',
          adoptedDate: null,
          stageReached: 'mock stage',
        },
      };

      await supplementaryDocumentsController.postAddDocument(mockRequest, res);

      expect(uploadFiles).toHaveBeenCalledWith([{ name: 'some-file' }], 'mock-id');
      expect(createOrUpdateAppealReply).toHaveBeenCalledWith({
        ...mockAppealReply,
        optionalDocumentsSection: {
          supplementaryPlanningDocuments: {
            uploadedFiles: [
              {
                id: 'mock-file-id',
                name: 'some-file.pdf',
                documentName: 'Mock Document',
                adoptedDate: null,
                stageReached: 'mock stage',
              },
            ],
          },
        },
      });
      expect(res.render).not.toHaveBeenCalledWith();
      expect(res.redirect).toHaveBeenCalledWith('/mock-id/supplementary-documents');
    });

    it('should redirect to task-list page if all fields left blank', async () => {
      mockErrorSummary = [
        { text: 'Upload a relevant supplementary planning document' },
        { text: 'Enter a name for the supplementary planning document' },
        { text: 'Select whether this supplementary planning document has been adopted' },
      ];

      const mockRequest = {
        ...req,
        body: {
          errors: mockError,
          errorSummary: mockErrorSummary,
        },
      };

      await supplementaryDocumentsController.postAddDocument(mockRequest, res);
      expect(res.redirect).toHaveBeenCalledWith('/mock-id/task-list');
    });

    it('should only display one date error messages if formally adopted is set to yes, and date is completely blank', async () => {
      const mockRawErrorSummary = [
        { text: 'Upload a relevant supplementary planning document' },
        { text: 'Enter a name for the supplementary planning document' },
        { text: 'Tell us the date the supplementary planning document was adopted' },
        { text: 'Date of adoption must include a month and year' },
        { text: 'Date of adoption must include a year' },
      ];

      const mockRequest = {
        ...req,
        body: {
          errorSummary: mockRawErrorSummary,
        },
      };

      await supplementaryDocumentsController.postAddDocument(mockRequest, res);
      expect(res.render).toHaveBeenCalledWith(VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        question: supplementaryDocumentsController.question,
        errors: {},
        errorSummary: [
          { text: 'Upload a relevant supplementary planning document' },
          { text: 'Enter a name for the supplementary planning document' },
          { text: 'Tell us the date the supplementary planning document was adopted' },
        ],
        values: emptyValues,
      });
    });
  });
});
