const config = require('../../config');
const validateFileSize = require('../custom/file-size');
const validMimeType = require('../custom/mime-type');
const validBinaryMimeType = require('../custom/mime-binary-type');
const {
  MIME_TYPE_DOC,
  MIME_BINARY_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
} = require('../../lib/mime-types');

module.exports = {
  'appeal-upload': {
    custom: {
      options: async (value, { req, path }) => {
        const { appeal } = req.session;

        const noFilePreviouslyUploaded =
          !appeal || !appeal.yourAppealSection.appealStatement.uploadedFile.id;

        const noNewFileUploaded =
          !req.files || Object.keys(req.files).length === 0 || !req.files[path];

        if (noFilePreviouslyUploaded) {
          if (noNewFileUploaded) {
            throw new Error('Upload the appeal statement');
          }
        } else if (noNewFileUploaded) {
          return true;
        }

        // check file extension type
        const { mimetype } = req.files[path];

        validMimeType(
          mimetype,
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

        // check binary mime type of file
        await validBinaryMimeType(
          req.files['appeal-upload'],
          [
            MIME_BINARY_TYPE_DOC,
            MIME_TYPE_DOCX,
            MIME_TYPE_PDF,
            MIME_TYPE_TIF,
            MIME_TYPE_JPEG,
            MIME_TYPE_PNG,
          ],
          'The selected file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
        );

        // check file size
        const { size } = req.files[path];

        validateFileSize(size, config.fileUpload.pins.uploadApplicationMaxFileSize);

        return true;
      },
    },
  },
};
