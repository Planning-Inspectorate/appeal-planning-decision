const { fileSizeDisplayHelper } = require('../../lib/file-upload-helpers');

module.exports = (givenFileSize, maxFileSize, fileName = 'The file') => {
  if (givenFileSize > maxFileSize) {
    throw new Error(`${fileName} must be smaller than ${fileSizeDisplayHelper(maxFileSize)}`);
  }

  return true;
};
