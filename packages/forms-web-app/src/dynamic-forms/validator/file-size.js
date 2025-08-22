const fileSizeDisplayHelper = require('../lib/file-size-display-helper');

/**
 * @param {number} givenFileSize
 * @param {number} maxFileSize
 * @param {string} fileName
 * @param {string|null} errorMsg
 * @returns {boolean}
 */
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
