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
	sanitizeCharactersInFilename(filename, maxLength = 200) {
		if (!filename || typeof filename !== 'string') {
			return filename;
		}

		// Remove any leading or trailing whitespace
		filename = filename.trim();

		// any character outside of alphanumeric characters, periods, hyphen, underscores replaced with a '-'
		const allowedCharsRegex = /[^a-zA-Z0-9.\-_]/g;
		filename = filename.replace(allowedCharsRegex, '-');

		// Split the filename into base name and extension
		const parts = filename.split('.');
		const baseName = parts[0];
		const extension = parts.slice(1).join('.');

		// Ensure the filename does not exceed the maximum length
		filename = baseName.slice(0, maxLength);

		// Reconstruct the filename with the modified base name
		return extension ? `${filename}.${extension}` : filename;
	},

	conjoinedPromises: async (
		objArr,
		asyncFunc,
		{ asyncDepMapPredicate = (obj) => obj, applyMode = false } = {
			asyncDepMapPredicate: (obj) => obj,
			applyMode: false
		}
	) => {
		const promiseMap = new Map(
			objArr.map((obj) => [
				obj,
				asyncFunc[applyMode ? 'apply' : 'call'](null, asyncDepMapPredicate(obj))
			])
		);

		const resolutionMap = new Map();
		for (const [obj, promise] of Array.from(promiseMap)) {
			const resolution = await promise;
			resolutionMap.set(obj, resolution);
		}

		return resolutionMap;
	}
};
