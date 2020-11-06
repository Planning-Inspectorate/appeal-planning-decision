/**
 * Utility methods
 */

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
    return Promise.race([
      promise,
      new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);

          reject(new Error('timeout'));
        }, timeoutValue);
      }),
    ]);
  },
};
