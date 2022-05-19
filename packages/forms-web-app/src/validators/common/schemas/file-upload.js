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
        const isSingleFile = uploadedFiles.length === 1;
        const singleFileMimeTypeErrorMsg =
          'The selected file must be a pdf, doc, docx, tif, tiff, jpg, jpeg or png';
        const multiFileMimeTypeErrorMsg = 'must be a DOC, DOCX, PDF, TIF, JPG or PNG';

        uploadedFiles.forEach(({ mimetype, name }) => {
          const errorMsg = isSingleFile
            ? singleFileMimeTypeErrorMsg
            : `${name} ${multiFileMimeTypeErrorMsg}`;
          validMimeType(mimetype, Object.values(mimeTypes), errorMsg);
        });

        const { name } = req.files[path];
        await validAV(req.files['file-upload'], name);

        await Promise.all(
          uploadedFiles.map((file) =>
            validateMimeBinaryType(
              file,
              Object.values(mimeTypes),
              isSingleFile
                ? singleFileMimeTypeErrorMsg
                : `${file.name} ${multiFileMimeTypeErrorMsg}`
            )
          )
        );

        const sizeErrorMsg = isSingleFile ? 'The selected file must be smaller than 15MB' : null;

        uploadedFiles.forEach(({ size, fileName }) => {
          validateFileSize(size, uploadApplicationMaxFileSize, fileName, sizeErrorMsg);
        });

        return true;
      },
    },
  },
});

module.exports = schema;
