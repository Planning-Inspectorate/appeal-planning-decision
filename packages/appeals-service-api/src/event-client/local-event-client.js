const logger = require('../lib/logger.js');

/**
 * Dummy event client for local development.
 * @class
 */
class LocalEventClient {
	constructor() {}

	sendEvents = async (/** @type {string} */ topic, /** @type {any[]} */ events, type) => {
		logger.info(
			`Dummy publishing events ${JSON.stringify(events)} to topic ${topic} of type ${type}`
		);

		return events;
	};
}

module.exports = { LocalEventClient };
