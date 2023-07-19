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
	testLPAONSCode
};
