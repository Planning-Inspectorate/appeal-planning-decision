const config = require('../../config');
const validateFileSize = require('../custom/file-size');
const validMimeType = require('../custom/mime-type');
const validBinaryMimeType = require('../custom/mime-binary-type');
//const validAV = require('../custom/clamav');
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
  'files.supporting-documents.*': {
    custom: {
      options: async (value) => {
        const { name, mimetype, size } = value;

        // check file extension type
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
          `${name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
        );

        // check file for Virus
        //await validAV(value, 'The selected file contains a virus');

        // check binary mime type of file
        await validBinaryMimeType(
          value,
          [
            MIME_BINARY_TYPE_DOC,
            MIME_TYPE_DOCX,
            MIME_TYPE_PDF,
            MIME_TYPE_TIF,
            MIME_TYPE_JPEG,
            MIME_TYPE_PNG,
          ],
          `${name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
        );

        // check file size
        validateFileSize(size, config.fileUpload.pins.uploadApplicationMaxFileSize, name);

        return true;
      },
    },
  },
};
