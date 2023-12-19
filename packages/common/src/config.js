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
	apis: {
		appealsApi: {
			url: process.env.APPEALS_SERVICE_API_URL,
			timeout: process.env.APPEALS_SERVICE_API_TIMEOUT
				? parseInt(process.env.APPEALS_SERVICE_API_TIMEOUT, 10)
				: 10000
		}
	}
};
