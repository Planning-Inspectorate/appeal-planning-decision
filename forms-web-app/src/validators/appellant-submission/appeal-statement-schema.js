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
  'appeal-upload': {
    custom: {
      options: (value, { req, path }) => {
        console.log(`is this being called?`);
        // file is optional, so valid if no file is given.
        if (!req.files || !req.files[path]) {
          console.log(`return true?`);
          return true;
        }
        console.log(`continue?`);

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

        validateFileSize(size, config.fileUpload.pins.appealStatementMaxFileSize);

        return true;
      },
    },
  },
};
