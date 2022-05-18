const validAV = require('@planning-inspectorate/pins-clamav-rest-client');
const { validMimeType, validateMimeBinaryType } = require('pins-mime-validation');
const {
  fileUpload: {
    pins: { uploadApplicationMaxFileSize },
  },
} = require('../../../config');
const validateFileSize = require('../../custom/file-size');
const mimeTypes = require('../../../lib/mime-types');

const hasAlreadyUploadedFile = (task) => {
  const { uploadedFile = {}, uploadedFiles = [] } = task;
  return !!uploadedFile.id || (uploadedFiles[0] && !!uploadedFiles[0].id);
};

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
          if (appeal[sectionName] && hasAlreadyUploadedFile(appeal[sectionName][taskName])) {
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

        const { name } = req.files[path];
        await validAV(req.files['file-upload'], name);

        await Promise.all(
          uploadedFiles.map((file) =>
            validateMimeBinaryType(
              file,
              Object.values(mimeTypes),
              `${file.name} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
            )
          )
        );

        uploadedFiles.forEach(({ size, fileName }) => {
          validateFileSize(size, uploadApplicationMaxFileSize, fileName);
        });

        return true;
      },
    },
  },
});

module.exports = schema;
