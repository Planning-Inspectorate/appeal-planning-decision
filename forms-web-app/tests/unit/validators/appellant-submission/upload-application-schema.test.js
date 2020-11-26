const schema = require('../../../../src/validators/appellant-submission/upload-application-schema');
const validateFileSize = require('../../../../src/validators/custom/file-size');
const validMimeType = require('../../../../src/validators/custom/mime-type');
const {
  MIME_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
} = require('../../../../src/lib/mime-types');
const config = require('../../../../src/config');

jest.mock('../../../../src/validators/custom/file-size');
jest.mock('../../../../src/validators/custom/mime-type');
jest.mock('../../../../src/config');

describe('validators/appellant-submission/upload-application-schema', () => {
  it('has a defined custom schema object', () => {
    expect(schema['upload-application'].custom.options).toBeDefined();
  });

  describe(`schema['upload-application'].custom.options`, () => {
    let fn;

    beforeEach(() => {
      fn = schema['upload-application'].custom.options;
    });

    it('should throw if `req.files` is undefined', () => {
      expect(() => fn('some value', { req: {} })).toThrow('Upload the planning application form');
    });

    it('should throw if `req.files` is an empty object', () => {
      expect(() => fn('some value', { req: { files: {} } })).toThrow(
        'Upload the planning application form'
      );
    });

    it('should throw if `req.files[path]` is not matched', () => {
      expect(() =>
        fn('some value', { req: { files: { a: { mimetype: MIME_TYPE_PDF } } }, path: 'x' })
      ).toThrow('Upload the planning application form');
    });

    it('should call the validMimeType validator', () => {
      fn('some value', { req: { files: { a: { mimetype: MIME_TYPE_PNG } } }, path: 'a' });
      expect(validMimeType).toHaveBeenCalledWith(
        MIME_TYPE_PNG,
        [
          MIME_TYPE_DOC,
          MIME_TYPE_DOCX,
          MIME_TYPE_PDF,
          MIME_TYPE_JPEG,
          MIME_TYPE_TIF,
          MIME_TYPE_PNG,
        ],
        'Doc is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
      );
    });

    it('should call the validateFileSize validator', () => {
      fn('some value', {
        req: { files: { a: { mimetype: MIME_TYPE_JPEG, size: 12345 } } },
        path: 'a',
      });
      expect(validateFileSize).toHaveBeenCalledWith(
        12345,
        config.fileUpload.pins.uploadApplicationMaxFileSize
      );
    });
  });
});
