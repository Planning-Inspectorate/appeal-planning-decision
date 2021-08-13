const { validMimeType } = require('pins-mime-validation');
const config = require('../../config');
const validateFileSize = require('../custom/file-size');
const {
  MIME_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
} = require('../../lib/file-upload-helpers');

module.exports = {
  'files.documents.*': {
    custom: {
      options: (value) => {
        const { name, mimetype, size } = value;

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
          `${name} is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG`
        );

        validateFileSize(size, config.fileUpload.pins.maxFileSize, name);

        return true;
      },
    },
  },
};
