/**
 * Logger
 *
 * Creates a log instance with common configuration that can be
 * used throughout the application
 */

const { pino } = require('pino');

module.exports = pino({
	level: 'error',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true
		}
	}
});
