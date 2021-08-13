const { validMimeType } = require('pins-mime-validation');
const schema = require('../../../../src/validators/appellant-submission/upload-decision-schema');
const validateFileSize = require('../../../../src/validators/custom/file-size');
const {
  MIME_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
} = require('../../../../src/lib/mime-types');
const config = require('../../../../src/config');

jest.mock('pins-mime-validation');
jest.mock('../../../../src/validators/custom/file-size');
jest.mock('../../../../src/config');

describe('validators/appellant-submission/upload-decision-schema', () => {
  const appealWithFile = {
    appeal: {
      requiredDocumentsSection: { decisionLetter: { uploadedFile: { id: 'decision.pdf' } } },
    },
  };

  const appealWithoutFile = {
    appeal: {
      requiredDocumentsSection: { decisionLetter: { uploadedFile: { id: null } } },
    },
  };

  it('has a defined custom schema object', () => {
    expect(schema['decision-upload'].custom.options).toBeDefined();
  });

  describe(`schema['decision-upload'].custom.options`, () => {
    let fn;

    beforeEach(() => {
      fn = schema['decision-upload'].custom.options;
    });

    it('should throw an error if `req.files` is undefined and no planning application was submitted', () => {
      expect(() => fn('some value', { req: { session: appealWithoutFile } })).rejects.toThrow(
        'Select a decision letter'
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
      ).rejects.toThrow('Select a decision letter');
    });

    it('should throw an error if `req.files[path]` is not matched and no planning application was submitted', () => {
      expect(() =>
        fn('some value', {
          req: { session: appealWithoutFile, files: { a: { mimetype: MIME_TYPE_PDF } } },
          path: 'x',
        })
      ).rejects.toThrow('Select a decision letter');
    });

    it('should return true if `req.files` is undefined but a decision letter was previously submitted', () => {
      expect(fn('some value', { req: { session: appealWithFile } })).toBeTruthy();
    });

    it('should return true if `req.files` is empty but a decision letter  was previously submitted', () => {
      expect(fn('some value', { req: { session: appealWithFile, files: {} } })).toBeTruthy();
    });

    it('should return true if `req.files[path]` is not matched but a decision letter  was previously submitted', () => {
      expect(
        fn('some value', {
          req: { session: appealWithFile, files: { a: { mimetype: MIME_TYPE_PDF } } },
          path: 'x',
        })
      ).toBeTruthy();
    });

    it('should call the validMimeType validator', async () => {
      await fn('some value', {
        req: {
          session: appealWithoutFile,
          files: { a: { mimetype: MIME_TYPE_DOCX } },
        },
        path: 'a',
      });
      expect(validMimeType).toHaveBeenCalledWith(
        MIME_TYPE_DOCX,
        [
          MIME_TYPE_DOC,
          MIME_TYPE_DOCX,
          MIME_TYPE_PDF,
          MIME_TYPE_JPEG,
          MIME_TYPE_TIF,
          MIME_TYPE_PNG,
        ],
        'The selected file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
      );
    });

    it('should call the validateFileSize validator', async () => {
      await fn('some value', {
        req: {
          session: appealWithoutFile,
          files: { a: { mimetype: MIME_TYPE_DOC, size: 12345 } },
        },
        path: 'a',
      });
      expect(validateFileSize).toHaveBeenCalledWith(
        12345,
        config.fileUpload.pins.uploadDecisionMaxFileSize
      );
    });
  });
});
