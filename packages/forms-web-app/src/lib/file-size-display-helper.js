// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404
const suffixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

module.exports = (bytes) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  return (!bytes && '0Bytes') || `${(bytes / 1000 ** i).toFixed()}${suffixes[i]}`;
};
