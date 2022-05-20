const fileSizeDisplayHelper = require('../../lib/file-size-display-helper');

module.exports = (givenFileSize, maxFileSize, fileName = 'The selected file', errorMsg = null) => {
  if (givenFileSize > maxFileSize) {
    if (errorMsg != null) {
      throw new Error(errorMsg);
    } else {
      throw new Error(`${fileName} must be smaller than ${fileSizeDisplayHelper(maxFileSize)}`);
    }
  }

  return true;
};
