const logger = require('./logger');

/** @type {Record<string, { timeToLive: number, result: any}>} */
const cacheStore = {};

/**
 * Get a cached value if valid, or set a new value with TTL
 * @template T
 * @param {string} key
 * @param {() => Promise<T>} fetchFn
 * @param {number} ttlMs
 * @returns {Promise<T>}
 */
exports.getOrSetCache = async (key, fetchFn, ttlMs) => {
	const now = Date.now();
	const entry = cacheStore[key];
	if (entry && entry.timeToLive > now) {
		logger.debug(entry.result, 'cached value found for key ' + key);
		return entry.result;
	}
	const newValue = await fetchFn();
	cacheStore[key] = {
		result: newValue,
		timeToLive: Date.now() + ttlMs
	};
	logger.info(`Cache set for key ${key} with TTL of ${ttlMs} ms`);
	return cacheStore[key].result;
};

/**
 * @param {string} key
 */
exports.removeFromCache = (key) => {
	try {
		delete cacheStore[key];
	} catch (error) {
		logger.error(`Error removing key ${key} from cache: ${error}`);
	}
};
