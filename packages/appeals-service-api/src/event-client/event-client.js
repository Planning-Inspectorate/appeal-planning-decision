const { LocalEventClient } = require('./local-event-client.js');
const { ServiceBusEventClient } = require('./service-bus-event-client.js');

/**
 *
 * @param {boolean} serviceBusEnabled
 * @param {string} serviceBusHostname
 * @returns {ServiceBusEventClient | LocalEventClient}
 */
function getEventClient(serviceBusEnabled, serviceBusHostname = '') {
	return serviceBusEnabled ? new ServiceBusEventClient(serviceBusHostname) : new LocalEventClient();
}
module.exports = {
	getEventClient
};
