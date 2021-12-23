const { validMimeType, validateMimeBinaryType } = require('pins-mime-validation');
const {
  fileUpload: {
    pins: { uploadApplicationMaxFileSize },
  },
} = require('../../../../../src/config');
const schema = require('../../../../../src/validators/common/schemas/file-upload');
const validateFileSize = require('../../../../../src/validators/custom/file-size');
const mimeTypes = require('../../../../../src/lib/mime-types');
const file = require('../../../../fixtures/file-upload');

jest.mock('pins-mime-validation');
jest.mock('../../../../../src/validators/custom/file-size');

describe('validators/common/schemas/file-upload', () => {
  let req;

  beforeEach(() => {
    req = {
      files: {},
    };
  });

  it('has a defined custom schema object', () => {
    expect(schema['file-upload'].custom.options).toBeDefined();
  });

  describe(`schema['file-upload'].custom.options`, () => {
    let fn;

    beforeEach(() => {
      fn = schema['file-upload'].custom.options;
    });

    it('should throw an error if req.files is null', () => {
      req.files = null;

      expect(() => fn(null, { req })).rejects.toThrow('Select a file to upload');
    });

    it('should throw an error if a file has not been uploaded', () => {
      req.files = {};

      expect(() => fn(null, { req })).rejects.toThrow('Select a file to upload');
    });

    it('should call the validMimeType validator when given a single file', () => {
      req.files = { 'file-upload': file };

      fn(null, { req, path: 'file-upload' });

      expect(validMimeType).toHaveBeenCalledTimes(1);
      expect(validMimeType).toHaveBeenCalledWith(
        file.mimetype,
        Object.values(mimeTypes),
        `${file.name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
      );
    });

    it('should call the validateMimeBinaryType validator when given a single file', async () => {
      req.files = { 'file-upload': file };

      await fn(null, { req, path: 'file-upload' });

      expect(validMimeType).toHaveBeenCalledTimes(1);
      expect(validateMimeBinaryType).toHaveBeenCalledWith(
        file,
        Object.values(mimeTypes),
        `${file.name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
      );
    });

    it('should call the validateFileSize validator when given a single file', async () => {
      req.files = { 'file-upload': file };

      await fn(null, { req, path: 'file-upload' });

      expect(validMimeType).toHaveBeenCalledTimes(1);
      expect(validateFileSize).toHaveBeenCalledWith(
        file.size,
        uploadApplicationMaxFileSize,
        file.name
      );
    });

    it('should call the validMimeType validator when given multiple files', () => {
      req.files = { 'file-upload': [file, file, file] };

      fn(null, { req, path: 'file-upload' });

      expect(validMimeType).toHaveBeenCalledTimes(3);
      expect(validMimeType).toHaveBeenCalledWith(
        file.mimetype,
        Object.values(mimeTypes),
        `${file.name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
      );
    });

    it('should call the validateMimeBinaryType validator when given multiple files', async () => {
      req.files = { 'file-upload': [file, file, file] };

      await fn(null, { req, path: 'file-upload' });

      expect(validMimeType).toHaveBeenCalledTimes(3);
      expect(validateMimeBinaryType).toHaveBeenCalledWith(
        file,
        Object.values(mimeTypes),
        `${file.name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
      );
    });

    it('should call the validateFileSize validator when given multiple files', async () => {
      req.files = { 'file-upload': [file, file, file] };

      await fn(null, { req, path: 'file-upload' });

      expect(validMimeType).toHaveBeenCalledTimes(3);
      expect(validateFileSize).toHaveBeenCalledWith(
        file.size,
        uploadApplicationMaxFileSize,
        file.name
      );
    });
  });
});
