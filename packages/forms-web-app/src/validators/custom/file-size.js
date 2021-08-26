const fileSizeDisplayHelper = require('../../lib/file-size-display-helper');

module.exports = (givenFileSize, maxFileSize, fileName = 'The selected file') => {
  if (givenFileSize > maxFileSize) {
    throw new Error(`${fileName} must be smaller than ${fileSizeDisplayHelper(maxFileSize)}`);
  }

  return true;
};
