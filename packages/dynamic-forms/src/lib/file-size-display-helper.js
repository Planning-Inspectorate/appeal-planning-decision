// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404
const suffixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

/**
 * @param {number} bytes
 * @param {boolean} binary
 * @returns {string}
 */
module.exports = (bytes, binary = true) => {
	const base = binary ? 1024 : 1000;
	const i = Math.floor(Math.log(bytes) / Math.log(base));
	return (!bytes && '0Bytes') || `${(bytes / base ** i).toFixed()}${suffixes[i]}`;
};
