// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404
const suffixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const getBytes = (bytes) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (!bytes && '0 Bytes') || `${(bytes / 1024 ** i).toFixed()} ${suffixes[i]}`;
};

module.exports = (givenFileSize, maxFileSize) => {
  if (givenFileSize > maxFileSize) {
    throw new Error(`The file must be smaller than ${getBytes(maxFileSize)}`);
  }

  return true;
};
