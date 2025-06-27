/**
 * Logger
 *
 * Creates a log instance with common configuration that can be
 * used throughout the application
 */

const { pino } = require('pino');
const config = require('../configuration/config');

module.exports = pino({
	level: config.logger.level,
	redact: config.logger.redact,
	transport: config.logger.prettyPrint
		? {
				target: 'pino-pretty',
				options: {
					colorize: true
				}
			}
		: undefined
});
