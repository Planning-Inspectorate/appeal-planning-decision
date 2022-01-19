// const validAV = require('pins-clamav');
const { validMimeType, validateMimeBinaryType } = require('pins-mime-validation');
const {
  fileUpload: {
    pins: { uploadApplicationMaxFileSize },
  },
} = require('../../../config');
const validateFileSize = require('../../custom/file-size');
const mimeTypes = require('../../../lib/mime-types');

const schema = (noFilesError) => ({
  'file-upload': {
    custom: {
      options: async (value, { req, path }) => {
        const {
          files,
          session: { appeal },
          sectionName,
          taskName,
        } = req;

        if (!files) {
          if (appeal[sectionName] && appeal[sectionName][taskName]?.uploadedFile.id) {
            return true;
          }

          throw new Error(noFilesError || 'Select a file to upload');
        }

        const uploadedFiles = !Array.isArray(files[path]) ? [files[path]] : files[path];

        uploadedFiles.forEach(({ mimetype, name }) => {
          validMimeType(
            mimetype,
            Object.values(mimeTypes),
            `${name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
          );
        });

        // check file for Virus
        // const { name } = req.files[path];
        // await validAV(req.files['file-upload'], name);

        await Promise.all(
          uploadedFiles.map((file) =>
            validateMimeBinaryType(
              file,
              Object.values(mimeTypes),
              `${file.name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
            )
          )
        );

        uploadedFiles.forEach(({ size, name }) => {
          validateFileSize(size, uploadApplicationMaxFileSize, name);
        });

        return true;
      },
    },
  },
});

module.exports = schema;
