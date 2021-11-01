const validAV = require('pins-clamav');
const { validMimeType } = require('pins-mime-validation');
const schema = require('../../../../src/validators/schemas/files');
const validateFileSize = require('../../../../src/validators/custom/file-size');
const {
  MIME_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
} = require('../../../../src/lib/file-upload-helpers');
const config = require('../../../../src/config');

jest.mock('pins-clamav');
jest.mock('pins-mime-validation');
jest.mock('../../../../src/validators/custom/file-size');
jest.mock('../../../../src/config');

describe('validators/schemas/files', () => {
  it('has a defined custom schema object', async () => {
    expect(await schema['files.documents.*'].custom.options).toBeDefined();
  });

  describe(`schema['files.documents.*'].custom.options`, () => {
    let fn;

    beforeEach(() => {
      fn = schema['files.documents.*'].custom.options;
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
        'pingu.penguin is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
      );
    });

    it('should call the validateFileSize validator', async () => {
      await fn({ mimetype: MIME_TYPE_JPEG, name: 'pingu.penguin', size: 12345 });

      // expect(validAV).toHaveBeenCalled();
      expect(validateFileSize).toHaveBeenCalledWith(
        12345,
        config.fileUpload.pins.maxFileSize,
        'pingu.penguin'
      );
    });
  });
});
