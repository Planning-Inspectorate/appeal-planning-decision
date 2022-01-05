const { validMimeType } = require('pins-mime-validation');
const schema = require('../../../../src/validators/appellant-submission/appeal-statement-schema');
const validateFileSize = require('../../../../src/validators/custom/file-size');
const {
  MIME_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
  MIME_TYPE_TXT,
} = require('../../../../src/lib/mime-types');
const config = require('../../../../src/config');

jest.mock('pins-mime-validation');
jest.mock('../../../../src/validators/custom/file-size');
jest.mock('../../../../src/config');

describe('validators/appellant-submission/appeal-statement-schema', () => {
  const session = {
    appeal: { yourAppealSection: { appealStatement: { uploadedFile: { id: null } } } },
  };

  it('has a defined custom schema object', () => {
    expect(schema['appeal-upload'].custom.options).toBeDefined();
  });

  describe(`schema['appeal-upload'].custom.options`, () => {
    let fn;

    beforeEach(() => {
      fn = schema['appeal-upload'].custom.options;
    });

    it('should return true if `req.files` is undefined and one appeal was previously submitted', () => {
      expect(
        fn('some value', {
          req: {
            session: {
              appeal: {
                yourAppealSection: { appealStatement: { uploadedFile: { id: 'appeal.pdf' } } },
              },
            },
          },
        })
      ).toBeTruthy();
    });

    it('should return true if `req.files` is empty and one appeal was previously submitted', () => {
      expect(
        fn('some value', {
          req: {
            session: {
              appeal: {
                yourAppealSection: { appealStatement: { uploadedFile: { id: 'appeal.pdf' } } },
              },
            },
            files: {},
          },
        })
      ).toBeTruthy();
    });

    it('should return true if `req.files[path]` is not matched and one appeal was previously submitted', () => {
      expect(
        fn('some value', {
          req: {
            session: {
              appeal: {
                yourAppealSection: { appealStatement: { uploadedFile: { id: 'appeal.pdf' } } },
              },
            },
            files: { a: { mimetype: MIME_TYPE_PDF } },
          },
          path: 'x',
        })
      ).toBeTruthy();
    });

    it('should throw error if `req.files` is undefined and no appeal was previously submitted', async () => {
      await expect(() =>
        fn('some value', {
          req: {
            session,
          },
        })
      ).rejects.toThrow('Select an appeal statement');
    });

    it('should throw error if `req.files` is empty and no appeal was previously submitted', async () => {
      await expect(() =>
        fn('some value', {
          req: {
            session,
            files: {},
          },
        })
      ).rejects.toThrow('Select an appeal statement');
    });

    it('should throw error if `req.files[path]` is not matched and no appeal was previously submitted', async () => {
      await expect(() =>
        fn('some value', { req: { session, files: { a: { mimetype: MIME_TYPE_PDF } } } })
      ).rejects.toThrow('Select an appeal statement');
    });

    it('should call the validMimeType validator', async () => {
      await fn('some value', {
        req: { session, files: { a: { mimetype: MIME_TYPE_PDF } } },
        path: 'a',
      });
      expect(validMimeType).toHaveBeenCalledWith(
        MIME_TYPE_PDF,
        [
          MIME_TYPE_DOC,
          MIME_TYPE_DOCX,
          MIME_TYPE_PDF,
          MIME_TYPE_JPEG,
          MIME_TYPE_TIF,
          MIME_TYPE_PNG,
          MIME_TYPE_TXT,
        ],
        'The selected file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
      );
    });

    it('should call the validateFileSize validator', async () => {
      await fn('some value', {
        req: { session, files: { a: { mimetype: MIME_TYPE_PDF, size: 12345 } } },
        path: 'a',
      });
      expect(validateFileSize).toHaveBeenCalledWith(
        12345,
        config.fileUpload.pins.appealStatementMaxFileSize
      );
    });
  });
});
