const deleteSupplementaryDocumentController = require('../../../../src/controllers/supplementary-documents/delete-supplementary-document');
const { VIEW } = require('../../../../src/lib/views');
const { createOrUpdateAppealReply } = require('../../../../src/lib/appeal-reply-api-wrapper');
const { deleteDocument } = require('../../../../src/lib/documents-api-wrapper');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../../src/lib/documents-api-wrapper');

describe('controllers/delete-supplementary-document', () => {
  const view = VIEW.SUPPLEMENTARY_DOCUMENTS.DELETE_DOCUMENT;
  let req;
  let res;
  let mockAppealReply;

  beforeEach(() => {
    mockAppealReply = {
      id: 'mock-reply-id',
      appealId: 'mock-appeal-id',
      optionalDocumentsSection: {
        supplementaryPlanningDocuments: {
          uploadedFiles: [
            { documentName: 'mock-document-name', stageReached: '' },
            { documentName: 'mock-document-name-2', stageReached: 'mock-stage' },
          ],
        },
      },
    };

    req = mockReq(mockAppealReply);
    res = mockRes();
    req.query = { row: '0' };

    jest.resetAllMocks();
  });

  describe('getDeleteDocument', () => {
    let fileToDelete;
    let cancelLink;
    let renderObject;

    beforeEach(() => {
      req.protocol = 'mock-protocol';
      req.headers = { host: 'mock-host' };
      req.log = { error: jest.fn() };
      fileToDelete = [
        [
          {
            text: 'mock-document-name',
            attributes: {
              'data-cy': 'table-row-header-0',
            },
          },
          { text: 'Yes' },
        ],
      ];
      cancelLink =
        'mock-protocol://mock-host/appeal-questionnaire/mock-appeal-id/supplementary-documents/uploaded-documents';
      renderObject = {
        cancelLink,
        fileToDelete,
        appeal: null,
        backLink: '/appeal-questionnaire/mock-id/mock-back-link',
        question: deleteSupplementaryDocumentController.question,
      };
    });

    it('should call the correct template', () => {
      req.session.backLink = '/appeal-questionnaire/mock-id/mock-back-link';
      deleteSupplementaryDocumentController.getDeleteDocument(req, res);
      expect(res.render).toHaveBeenCalledWith(view, renderObject);
    });

    it('should call task-list as a default back link if nothing set in session', () => {
      deleteSupplementaryDocumentController.getDeleteDocument(req, res);
      renderObject.backLink = `/appeal-questionnaire/mock-id/${VIEW.TASK_LIST}`;
      expect(res.render).toHaveBeenCalledWith(view, renderObject);
    });

    it('should call back link from locals as priority if provided', () => {
      req.session.backLink = '/appeal-questionnaire/mock-id/mock-back-link';
      res.locals.backLink = '/appeal-questionnaire/some/other/backlink';
      renderObject.backLink = '/appeal-questionnaire/some/other/backlink';
      deleteSupplementaryDocumentController.getDeleteDocument(req, res);
      expect(res.render).toHaveBeenCalledWith(view, renderObject);
    });

    it('should identify the second file in the array as the one to delete', () => {
      req.session.backLink = '/appeal-questionnaire/mock-id/mock-back-link';
      req.query = { row: '1' };
      deleteSupplementaryDocumentController.getDeleteDocument(req, res);
      renderObject = {
        ...renderObject,
        fileToDelete: [
          [
            {
              text: 'mock-document-name-2',
              attributes: {
                'data-cy': 'table-row-header-1',
              },
            },
            { text: 'No' },
          ],
        ],
      };
      expect(res.render).toHaveBeenCalledWith(view, renderObject);
    });
  });

  describe('postDeleteDocument', () => {
    const baseRedirect = '/appeal-questionnaire/mock-appeal-id/supplementary-documents';
    let mockRequest;
    let expectedAppealReply;

    beforeEach(() => {
      expectedAppealReply = {
        ...mockAppealReply,
        optionalDocumentsSection: {
          supplementaryPlanningDocuments: {
            uploadedFiles: [],
          },
        },
      };

      mockRequest = {
        ...req,
        session: {
          appealReply: {
            ...mockAppealReply,
            optionalDocumentsSection: {
              supplementaryPlanningDocuments: {
                uploadedFiles: [
                  {
                    documentName: 'mock-document-name',
                    id: 'mock-id',
                    stageReached: '',
                  },
                ],
              },
            },
          },
        },
      };
    });

    it('should redirect to add-document as there are no documents left to delete', async () => {
      await deleteSupplementaryDocumentController.postDeleteDocument(mockRequest, res);
      expect(deleteDocument).toHaveBeenCalledWith('mock-reply-id', 'mock-id');
      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(expectedAppealReply);
      expect(res.redirect).toHaveBeenCalledWith(`${baseRedirect}/uploaded-documents`);
    });

    it('should redirect to uploaded-document as there are documents left to delete', async () => {
      mockRequest.session.appealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles = [
        {
          documentName: 'mock-document-name',
          id: 'mock-id',
          stageReached: 'mock-stage',
        },
        {
          documentName: 'mock-document-name-2',
          id: 'mock-id-2',
          stageReached: 'mock-stage-2',
        },
      ];

      expectedAppealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles = [
        {
          documentName: 'mock-document-name-2',
          id: 'mock-id-2',
          stageReached: 'mock-stage-2',
        },
      ];

      await deleteSupplementaryDocumentController.postDeleteDocument(mockRequest, res);
      expect(deleteDocument).toHaveBeenCalledWith('mock-reply-id', 'mock-id');
      expect(createOrUpdateAppealReply).toHaveBeenCalledWith(expectedAppealReply);
      expect(res.redirect).toHaveBeenCalledWith(`${baseRedirect}/uploaded-documents`);
    });

    it('should throw a error', async () => {
      deleteDocument.mockImplementation(() => {
        throw new Error();
      });

      await deleteSupplementaryDocumentController.postDeleteDocument(req, res);
      expect(req.log.error).toHaveBeenCalledWith({ err: Error() }, 'Error deleting file');
      expect(createOrUpdateAppealReply).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`${baseRedirect}/add-document`);
    });
  });
});
