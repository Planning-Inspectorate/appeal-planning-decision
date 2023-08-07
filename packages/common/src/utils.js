/**
 * Utility methods
 */

const testLPAONSCode = 'E69999999';
const testLPACode = 'Q9999';

module.exports = {
	/**
	 * Promise Timeout
	 *
	 * Add a timeout to a promise.
	 *
	 * @param {number} timeoutValue
	 * @param {Promise} promise
	 * @return {Promise<any>}
	 */
	promiseTimeout(timeoutValue, promise) {
		let timeoutId;
		return Promise.race([
			Promise.resolve().then(async () => {
				const result = await promise;

				/* istanbul ignore else */
				if (timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = undefined;
				}

				return result;
			}),
			new Promise((resolve, reject) => {
				timeoutId = setTimeout(() => {
					/* istanbul ignore next */
					if (timeoutId) {
						clearTimeout(timeoutId);
						timeoutId = undefined;
					}

					reject(new Error('timeout'));
				}, timeoutValue);
			})
		]);
	},

	/**
	 * Check if LPA is System Test Borough Council.
	 *
	 * @param {string} lpaCode
	 * @return {boolean}
	 */
	isTestLPA(lpaCode) {
		return lpaCode === testLPACode || lpaCode === testLPAONSCode;
	},
	testLPACode,
	testLPAONSCode,
	/**
	 * Sanitizes a given filename by removing disallowed characters and ensuring its length does not exceed a maximum value.
	 *
	 * @param {string} filename - The original filename to be sanitized.
	 * @param {number} [maxLength=100] - The maximum allowed length of the sanitized filename.
	 * @returns {string} - The sanitized filename.
	 */
	sanitizeCharactersInFilename(filename, maxLength = 100) {
		if (!filename || typeof filename !== 'string') {
			return filename;
		}

		// Remove any leading or trailing whitespace
		filename = filename.trim();

		// any character outside of alphanumeric characters, periods, hyphen, underscores replaced with a '-'
		const allowedCharsRegex = /[^a-zA-Z0-9.\-_]/g;
		filename = filename.replace(allowedCharsRegex, '-');

		// Ensure the filename does not exceed the maximum length
		filename = filename.slice(0, maxLength);

		return filename;
	}
};
