/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * environments should be driven by environment variables where different
 * values are required
 */

module.exports = {
	logger: {
		level: process.env.LOGGER_LEVEL || 'info'
	}
};
