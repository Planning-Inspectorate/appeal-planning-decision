const uploadedDocumentsController = require('../../../../src/controllers/supplementary-documents/uploaded-documents');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/uploaded-documents', () => {
  const uploadedDocumentsUrl = 'mock-protocol://mock-hostmock-url';
  const view = VIEW.SUPPLEMENTARY_DOCUMENTS.UPLOADED_DOCUMENTS;
  let req;
  let res;
  let mockAppealReply;
  let uploadedFiles;
  let renderObject;

  beforeEach(() => {
    req = mockReq(mockAppealReply);
    res = mockRes();

    req.protocol = 'mock-protocol';
    req.headers = { host: 'mock-host' };
    req.url = 'mock-url';

    mockAppealReply = {
      id: 'mock-id',
      optionalDocumentsSection: {
        supplementaryPlanningDocuments: { uploadedFiles: [] },
      },
    };

    uploadedFiles = [];

    renderObject = {
      appeal: null,
      backLink: '/appeal-questionnaire/mock-id/mock-back-link',
      question: uploadedDocumentsController.question,
      uploadedDocumentsUrl,
      uploadedFiles,
    };

    jest.resetAllMocks();
  });

  describe('getUploadedDocuments', () => {
    it.only('should call the correct template', () => {
      req = mockReq(mockAppealReply);
      const mockRequest = {
        ...req,
        protocol: 'mock-protocol',
        headers: {
          host: 'mock-host',
        },
        url: 'mock-url',
      };

      req.session.backLink = '/appeal-questionnaire/mock-id/mock-back-link';
      uploadedDocumentsController.getUploadedDocuments(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(view, renderObject);
    });

    it.only('should call task-list as a default back link if nothing set in session', () => {
      uploadedDocumentsController.getUploadedDocuments(req, res);
      renderObject.backLink = `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`;

      expect(res.render).toHaveBeenCalledWith(view, renderObject);
    });

    it.only('should call back link from locals as priority if provided', () => {
      req.session.backLink = '/appeal-questionnaire/mock-id/mock-back-link';
      res.locals.backLink = '/appeal-questionnaire/some/other/backlink';
      renderObject.backLink = '/appeal-questionnaire/some/other/backlink';

      uploadedDocumentsController.getUploadedDocuments(req, res);

      expect(res.render).toHaveBeenCalledWith(view, renderObject);
    });

    it.only('should be called with the correct uploadedFiles structure', () => {
      const mockRequest = {
        ...req,
        session: {
          backLink: '/appeal-questionnaire/mock-id/mock-back-link',
          appealReply: {
            ...mockAppealReply,
            optionalDocumentsSection: {
              supplementaryPlanningDocuments: {
                uploadedFiles: [
                  {
                    documentName: 'mock-document-name-no',
                    adoptedDate: '0-0',
                    stageReached: 'mock-staged-reached',
                  },
                  {
                    documentName: 'mock-document-name-yes',
                    adoptedDate: '01-01-2000',
                    stageReached: '',
                  },
                ],
              },
            },
          },
        },
      };

      renderObject.uploadedFiles = [
        [
          { text: 'mock-document-name-no' },
          { text: 'No - mock-staged-reached' },
          { class: 'govuk-link', html: '<a href="delete-document?row=0">Delete</a>' },
        ],
        [
          { text: 'mock-document-name-yes' },
          { text: 'Yes - Adopted on 1 January 2000' },
          { class: 'govuk-link', html: '<a href="delete-document?row=1">Delete</a>' },
        ],
      ];

      // console.log({ mockRequest });

      uploadedDocumentsController.getUploadedDocuments(mockRequest, res);
      expect(res.render).toHaveBeenCalledWith(view, renderObject);
    });
  });
});
