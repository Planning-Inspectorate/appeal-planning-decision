const fileContentType = require('file-type');
const fs = require('fs');
const validMimeType = require('./mime-type');

module.exports = async (fileInformation, allowableMimeTypes, errorMessage) => {
  if (typeof fileInformation !== 'undefined') {
    if (typeof fileInformation.tempFilePath !== 'undefined') {
      const fileStream = fs.createReadStream(fileInformation.tempFilePath);
      const fileStreamType = await fileContentType.fromStream(fileStream);
      validMimeType(fileStreamType?.mime, allowableMimeTypes, errorMessage);
    }
  }
  return true;
};
