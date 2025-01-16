/**
 * Utility methods
 */

const testLPAONSCode = 'E69999999';
const testLPAONSCode2 = 'E69999991';
const testLPACode = 'Q9999';
const testLPACode2 = 'Q1111';

module.exports = {
	/**
	 * Promise Timeout
	 *
	 * Add a timeout to a promise.
	 *
	 * @template T
	 * @param {number} timeoutValue
	 * @param {Promise<T>} promise
	 * @return {Promise<T>}
	 */
	promiseTimeout(timeoutValue, promise) {
		/**
		 * @type NodeJS.Timeout | undefined
		 */
		let timeoutId;
		return Promise.race([
			Promise.resolve().then(async () => {
				const result = await promise;

				if (timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = undefined;
				}

				return result;
			}),
			new Promise((resolve, reject) => {
				timeoutId = setTimeout(() => {
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
		return (
			lpaCode === testLPACode ||
			lpaCode === testLPAONSCode ||
			lpaCode === testLPACode2 ||
			lpaCode === testLPAONSCode2
		);
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

	/**
	 * replaces new line chars with a <br>
	 * @param {string} [value]
	 * @returns {string}
	 */
	nl2br(value) {
		if (!value) return '';

		return value.replace(/\r\n|\n/g, '<br>');
	},

	/**
	 * @template Arg
	 * @template TResolution
	 * @param {Arg[]} argArr
	 * @param {(arg0: Arg) => Promise<TResolution>} asyncFunc
	 * @returns {Promise<Map<Arg, TResolution>>}
	 */
	conjoinedPromises: async (argArr, asyncFunc) => {
		const promiseMap = new Map(argArr.map((arg) => [arg, asyncFunc(arg)]));

		const resolutionMap = new Map();
		for (const [arg, promise] of Array.from(promiseMap)) {
			const resolution = await promise;
			resolutionMap.set(arg, resolution);
		}

		return resolutionMap;
	}
};
