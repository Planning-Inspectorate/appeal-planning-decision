const logger = require('../lib/logger');

/**
 * Dummy event client for local development.
 * @class
 */
class LocalEventClient {
	constructor() {}

	sendEvents = async (/** @type {string} */ topic, /** @type {any[]} */ events) => {
		logger.info(`Dummy publishing events ${JSON.stringify(events)} to topic ${topic}`);

		return events;
	};
}

module.exports = { LocalEventClient };
