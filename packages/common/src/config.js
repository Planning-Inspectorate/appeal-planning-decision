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
	pdf: {
		url: process.env.PDF_SERVICE_API_URL
	}
};
