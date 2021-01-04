const fileSizeDisplayHelper = require('../../lib/file-size-display-helper');

module.exports = (givenFileSize, maxFileSize) => {
  if (givenFileSize > maxFileSize) {
    throw new Error(`The file must be smaller than ${fileSizeDisplayHelper(maxFileSize)}`);
  }

  return true;
};
