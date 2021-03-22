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

exports.getErrorHtml = (error) => {
  return `<span class="moj-multi-file-upload__error">
    <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
      <path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z"/>
    </svg>
    ${error}
  </span>`;
};

exports.getSuccessHtml = (name) => {
  return `<span class="moj-multi-file-upload__success">
      <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
        <path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"/>
      </svg>
      ${name}
    </span>`;
};
