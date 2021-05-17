const fileContentType = require('file-type');
const fs = require('fs');
const validMimeType = require('./mime-type');

module.exports = async (fileInformation, allowableMimeTypes, errorMessage) => {

  console.log('Start');
  console.log(fileInformation);
  if (typeof fileInformation !== 'undefined') {
    console.log('Start2');
    if (typeof fileInformation.tempFilePath !== 'undefined') {
      console.log('Inner');
      const fileStream = fs.createReadStream(fileInformation.tempFilePath);
      console.log('Inner2');
      //console.log(fileStream);
      const fileStreamType = await fileContentType.fromStream(fileStream);
console.log(fileStreamType);
      validMimeType(fileStreamType?.mime, allowableMimeTypes, errorMessage);
    }
  }
  console.log('end');
  return true;
};
