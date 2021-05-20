const { createDocument } = require('./documents-api-wrapper');

// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404
const suffixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

exports.fileSizeDisplayHelper = (bytes) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  return (!bytes && '0 Bytes') || `${(bytes / 1000 ** i).toFixed()} ${suffixes[i]}`;
};

exports.MIME_TYPE_DOC = 'application/msword';
exports.MIME_TYPE_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
exports.MIME_TYPE_PDF = 'application/pdf';
exports.MIME_TYPE_TIF = 'image/tiff';
exports.MIME_TYPE_JPEG = 'image/jpeg';
exports.MIME_TYPE_PNG = 'image/png';

/**
 * Constructs errorSummary for page with MOJ multi file upload
 * due to the way express validator handles errors, and the fact that file errors persist after a post
 * we need to build a custom summary rather than use standard output from validator
 *
 * @param {String} inputError error message for input
 * @param {Object} files list of files to check for errors
 * @param {String} inputName name of file input (defaults to 'documents')
 * @returns errorSummary array
 */
exports.fileErrorSummary = (inputError, files, inputName = 'documents') => {
  return [
    ...(inputError
      ? [
          {
            href: `#${inputName}`,
            text: inputError,
          },
        ]
      : []),
    ...(Array.isArray(files) && files.length
      ? files.reduce((errorsOutput, file) => {
          if (file.error)
            errorsOutput.push({
              href: `#${file.name}`,
              text: file.error,
            });
          return errorsOutput;
        }, [])
      : []),
  ];
};

const getErrorHtml = (error, name) => {
  return `<span class="moj-multi-file-upload__error" id="${name}">
      <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
        <path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z"/>
      </svg>
      ${error}
    </span>`;
};

const getSuccessHtml = (name) => {
  return `<span class="moj-multi-file-upload__success">
      <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
        <path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"/>
      </svg>
      ${name}
    </span>`;
};

exports.fileUploadNunjucksVariables = (errorMessage, errorSummary, files) => ({
  errorMessage,
  errorSummary,
  ...(files && files.length
    ? {
        uploadedFiles: files.map((doc) => ({
          deleteButton: {
            text: 'Delete',
          },
          fileName: doc.id || doc.name,
          originalFileName: doc.name,
          message: {
            html: doc.error ? getErrorHtml(doc.error, doc.name) : getSuccessHtml(doc.name),
          },
        })),
        documentList: JSON.stringify(files).replace(/[[\]']+/g, ''),
      }
    : {}),
});

/**
 * Uploads files to document service and returns list of documents with ID's for upload to DB
 * If error, returns error
 * @param {Array} files array of files from system
 * @param {String} appealReplyId UUID string for appeal reply
 * @returns {Promise} array of files with IDs and data for DB
 */
exports.uploadFiles = async (files, appealReplyId) => {
  try {
    return await Promise.all(
      files.map(async (file) => {
        // skip file if it has an error (keep it in array though)
        const document = file.id || file.error ? file : await createDocument(appealReplyId, file);

        // eslint-disable-next-line consistent-return
        return {
          id: document.id,
          name: file.name,
          message: {
            text: file.name,
          },
          fileName: file.name,
          error: file.error,
          originalFileName: file.name,
          // needed for Cypress testing
          location: document.location,
          size: document.size,
        };
      })
    );
  } catch (err) {
    return err;
  }
};
