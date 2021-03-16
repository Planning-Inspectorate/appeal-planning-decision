const clearUploadedFilesMiddleware = require('../../../src/middleware/clear-uploaded-files');
const { mockReq, mockRes } = require('../mocks');

describe('middleware/clear-uploaded-files', () => {
  let req;
  let next;

  beforeEach(() => {
    req = mockReq();
    next = jest.fn();

    jest.resetAllMocks();
  });

  it('should call next immediately if no session', () => {
    req.session = null;

    clearUploadedFilesMiddleware(req, mockRes, next);

    expect(next).toHaveBeenCalled();
  });

  it('should clear uploaded files if not empty', () => {
    req.session.uploadedFiles = ['some file'];

    clearUploadedFilesMiddleware(req, mockRes, next);

    expect(next).toHaveBeenCalled();
    expect(req.session.uploadedFiles).toEqual([]);
  });
});
