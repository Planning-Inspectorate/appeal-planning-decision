const clearUploadedFilesMiddleware = require('../../../src/middleware/check-if-supplementary-documents');
const { mockReq, mockRes } = require('../mocks');

describe('middleware/check-if-supplementary-documents', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = jest.fn();

    req.session.appealReply.appealId = 'mock-id';

    jest.resetAllMocks();
  });

  it('should redirect to add-documents', () => {
    req.session.appealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles = [];
    clearUploadedFilesMiddleware(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/mock-id/supplementary-documents');
  });

  it('should redirect to uploaded-documents', () => {
    req.session.appealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles = [
      'mock-file',
    ];
    clearUploadedFilesMiddleware(req, res, next);
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
