const { LocalEventClient } = require('./local-event-client.js');
const { ServiceBusEventClient } = require('./service-bus-event-client.js');

/**
 * @typedef {Function} InfoFunction
 * @param {string} content
 */

/** @typedef {{info: InfoFunction}} Logger */

/**
 *
 * @param {boolean} serviceBusEnabled
 * @param {any} logger
 * @param {string} serviceBusHostname
 * @returns {ServiceBusEventClient | LocalEventClient}
 */
function getEventClient(serviceBusEnabled, serviceBusHostname = '') {
	return serviceBusEnabled ? new ServiceBusEventClient(serviceBusHostname) : new LocalEventClient();
}
module.exports = {
	getEventClient
};
