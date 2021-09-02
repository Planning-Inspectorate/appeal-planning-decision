const schema = require('../../../../src/validators/appellant-submission/supporting-documents-schema');
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

describe('validators/appellant-submission/supporting-documents-schema', () => {
  it('has a defined custom schema object', () => {
    expect(schema['files.supporting-documents.*'].custom.options).toBeDefined();
  });

  describe(`schema['files.supporting-documents.*'].custom.options`, () => {
    let fn;

    beforeEach(() => {
      fn = schema['files.supporting-documents.*'].custom.options;
    });

    it('should call the validMimeType validator', () => {
      fn({ mimetype: MIME_TYPE_PNG, name: 'pingu.penguin' });
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
        'pingu.penguin must be a DOC, DOCX, PDF, TIF, JPG or PNG'
      );
    });

    it('should call the validateFileSize validator', async () => {
      await fn({ mimetype: MIME_TYPE_JPEG, name: 'pingu.penguin', size: 12345 });
      expect(validateFileSize).toHaveBeenCalledWith(
        12345,
        config.fileUpload.pins.supportingDocumentsMaxFileSize,
        'pingu.penguin'
      );
    });
  });
});
