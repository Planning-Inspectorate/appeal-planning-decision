const logger = require('./logger');

/**
 * Sleep for a given number of milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async function with delay and max attempts
 * @template T
 * @param {() => Promise<T>} fetchFn
 * @param {number} [retryDelayMs] - defaults to 200ms
 * @param {number} [maxRetries] - defaults to 3, capped to 5
 * @param {(error: any, attempt: number) => void} [logOnRetryFn]
 * @returns {Promise<T>}
 */
exports.retryAsync = async (
	fetchFn,
	retryDelayMs = 200,
	maxRetries = 3,
	logOnRetryFn,
	attempt = 1
) => {
	if (maxRetries > 5 && attempt === 1) logger.warn(`retryAsync - maxRetries is limited to 5`);

	try {
		return await fetchFn();
	} catch (error) {
		if (attempt < Math.min(maxRetries, 5)) {
			if (logOnRetryFn) logOnRetryFn(error, attempt);
			await sleep(retryDelayMs);
			return exports.retryAsync(fetchFn, retryDelayMs, maxRetries, logOnRetryFn, attempt + 1);
		} else {
			throw error;
		}
	}
};
