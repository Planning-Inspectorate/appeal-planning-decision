const multer = require('multer');
const uploadLocalFile = require('./uploadLocalFile');
const { mockReq, mockRes, mockNext } = require('../../test/utils/mocks');
const config = require('./config');

jest.mock('multer');

describe('lib/uploadLocalFile', () => {
  const res = mockRes();

  let multerUploadReturnValue;
  let multerReturnValue;
  let req;

  beforeEach(() => {
    multerUploadReturnValue = jest.fn();
    multerReturnValue = {
      single: jest.fn().mockReturnValue(multerUploadReturnValue),
    };
    multer.mockReturnValue(multerReturnValue);
    multer.diskStorage.mockReturnValue('diskStorageConfig');

    req = {
      ...mockReq,
      file: {
        name: 'test-pdf.pdf',
        mimetype: 'application/pdf',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return next if no error', (cb) => {
    multerUploadReturnValue.mockImplementation((request, response, next) => {
      next();
    });

    uploadLocalFile(req, res, cb);
  });

  it('should return a LIMIT_FILE_SIZE as a 422 error', () => {
    multerUploadReturnValue.mockImplementation((request, response, next) => {
      next({
        code: 'LIMIT_FILE_SIZE',
      });
    });

    uploadLocalFile(req, res);

    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(422);
    expect(res.send).toBeCalledTimes(1);
    expect(res.send).toBeCalledWith({
      message: 'File too large',
      maxSize: config.fileUpload.maxSizeInBytes,
    });
  });

  it('should trigger a next error if a multer error', (cb) => {
    const err = 'some-error';
    multerUploadReturnValue.mockImplementation((request, response, next) => {
      next(err);
    });

    uploadLocalFile(req, res, (error) => {
      expect(error).toBe(err);
      cb();
    });
  });

  it('should return an error when a file is not uploaded', () => {
    delete req.file;

    multerUploadReturnValue.mockImplementation((request, response, next) => {
      next();
    });

    uploadLocalFile(req, res, mockNext);

    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledTimes(1);
    expect(res.send).toBeCalledWith({ message: 'No file uploaded' });
    expect(mockNext).not.toBeCalled();
  });

  it('should return an error when given a file with an invalid mime type', () => {
    req.file = {
      name: 'test-text.txt',
      mimetype: 'text/plain',
    };

    multerUploadReturnValue.mockImplementation((request, response, next) => {
      next();
    });

    uploadLocalFile(req, res, mockNext);

    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(400);
    expect(res.send).toBeCalledTimes(1);
    expect(res.send).toBeCalledWith({
      message: 'Invalid mime type',
      mimeType: req.file.mimetype,
      allowed: config.fileUpload.mimeTypes,
    });
    expect(mockNext).not.toBeCalled();
  });
});
