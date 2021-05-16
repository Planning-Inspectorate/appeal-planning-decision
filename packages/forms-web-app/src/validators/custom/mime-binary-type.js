const fileContentType = require('file-type');
const fs = require('fs');
const validMimeType = require('./mime-type');

module.exports = async (fileInformation, allowableMimeTypes, errorMessage) => {
  if (typeof fileInformation !== 'undefined') {
    const fileStream = fs.createReadStream(fileInformation.tempFilePath);
    // const fileStreamType = await fileContentType.fromStream(fileStream);
    //
    // const fileBinaryMime = fileStreamType?.mime || null;
    //
    // validMimeType(fileBinaryMime, allowableMimeTypes, errorMessage);
  }

  return true;
};
