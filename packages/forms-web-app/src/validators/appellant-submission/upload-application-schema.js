// const validAV = require('pins-clamav');
const { validMimeType, validateMimeBinaryType } = require('pins-mime-validation');
const config = require('../../config');
const validateFileSize = require('../custom/file-size');

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
  'application-upload': {
    custom: {
      options: async (value, { req, path }) => {
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

        // check file for Virus
        // const { name } = req.files[path];
        // await validAV(req.files['application-upload'], name);

        // check binary mime type of file
        await validateMimeBinaryType(
          req.files['application-upload'],
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
