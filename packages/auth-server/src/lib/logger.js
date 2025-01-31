/**
 * Logger
 *
 * Creates a log instance with common configuration that can be
 * used throughout the application
 */

import pino from 'pino';

/**
 * Cache the logger instance
 * @type {import('pino').Logger|undefined}
 */
let logger;

/**
 * @param {import('../configuration/config').default} config
 * @returns {import('pino').Logger}
 */
export function getLogger(config) {
	if (logger) {
		return logger;
	}

	logger = pino({
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

	return logger;
}
