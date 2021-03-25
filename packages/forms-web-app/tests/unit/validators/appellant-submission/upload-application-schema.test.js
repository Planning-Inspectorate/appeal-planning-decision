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
  const appealWithFile = {
    appeal: {
      requiredDocumentsSection: { originalApplication: { uploadedFile: { id: 'planning.pdf' } } },
    },
  };

  const appealWithoutFile = {
    appeal: {
      requiredDocumentsSection: { originalApplication: { uploadedFile: { id: null } } },
    },
  };

  it('has a defined custom schema object', () => {
    expect(schema['application-upload'].custom.options).toBeDefined();
  });

  describe(`schema['application-upload'].custom.options`, () => {
    let fn;

    beforeEach(() => {
      fn = schema['application-upload'].custom.options;
    });

    it('should throw an error if `req.files` is undefined and no planning application was submitted', () => {
      expect(() => fn('some value', { req: { session: appealWithoutFile } })).toThrow(
        'Select a planning application form'
      );
    });

    it('should throw an error if `req.files` is empty and no planning application was submitted', () => {
      expect(() =>
        fn('some value', {
          req: {
            session: appealWithoutFile,
            files: {},
          },
        })
      ).toThrow('Select a planning application form');
    });

    it('should throw an error if `req.files[path]` is not matched and no planning application was submitted', () => {
      expect(() =>
        fn('some value', {
          req: { session: appealWithoutFile, files: { a: { mimetype: MIME_TYPE_PDF } } },
          path: 'x',
        })
      ).toThrow('Select a planning application form');
    });

    it('should return true if `req.files` is undefined but an application was previously submitted', () => {
      expect(fn('some value', { req: { session: appealWithFile } })).toBeTruthy();
    });

    it('should return true if `req.files` is empty but an application was previously submitted', () => {
      expect(fn('some value', { req: { session: appealWithFile, files: {} } })).toBeTruthy();
    });

    it('should return true if `req.files[path]` is not matched but an application was previously submitted', () => {
      expect(
        fn('some value', {
          req: { session: appealWithFile, files: { a: { mimetype: MIME_TYPE_PDF } } },
          path: 'x',
        })
      ).toBeTruthy();
    });

    it('should call the validMimeType validator', () => {
      fn('some value', {
        req: { session: appealWithFile, files: { a: { mimetype: MIME_TYPE_PNG } } },
        path: 'a',
      });
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
        req: {
          session: appealWithFile,
          files: { a: { mimetype: MIME_TYPE_JPEG, size: 12345 } },
        },
        path: 'a',
      });
      expect(validateFileSize).toHaveBeenCalledWith(
        12345,
        config.fileUpload.pins.uploadApplicationMaxFileSize
      );
    });
  });
});
