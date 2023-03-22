/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required
 */

module.exports = {
	logger: {
		level: process.env.LOGGER_LEVEL || 'info'
	},
	featureFlagging: {
		endpoint: process.env.PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING,
		timeToLiveInMinutes: process.env.FEATURE_FLAG_CACHE_TIMER || 5
	}
};
