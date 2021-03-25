const config = require('../../config');
const validateFileSize = require('../custom/file-size');
const validMimeType = require('../custom/mime-type');
const {
  MIME_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
} = require('../../lib/mime-types');

module.exports = {
  'application-upload': {
    custom: {
      options: (value, { req, path }) => {
        const { appeal } = req.session;

        const noFilePreviouslyUploaded =
          !appeal || !appeal.requiredDocumentsSection.originalApplication.uploadedFile.id;

        const noNewFileUploaded =
          !req.files || Object.keys(req.files).length === 0 || !req.files[path];

        if (noFilePreviouslyUploaded) {
          if (noNewFileUploaded) {
            throw new Error('Select a planning application form');
          }
        } else if (noNewFileUploaded) {
          return true;
        }

        const { mimetype, size } = req.files[path];

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
          'Doc is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
        );

        validateFileSize(size, config.fileUpload.pins.uploadApplicationMaxFileSize);

        return true;
      },
    },
  },
};
