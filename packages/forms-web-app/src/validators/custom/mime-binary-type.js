const fileContentType = require('file-type');
const fs = require('fs');
const validMimeType = require('./mime-type');

module.exports = async (fileInformation, allowableMimeTypes, errorMessage) => {
  console.log(fileInformation);
  console.log(allowableMimeTypes);
  console.log(errorMessage);
  if (typeof fileInformation !== 'undefined') {
    if (typeof fileInformation.tempFilePath !== 'undefined') {
      const fileStream = fs.createReadStream(fileInformation.tempFilePath);
      const fileStreamType = await fileContentType.fromStream(fileStream);

      const fileBinaryMime = fileStreamType?.mime || null;

      validMimeType(fileBinaryMime, allowableMimeTypes, errorMessage);
    }
  }

  return true;
};
