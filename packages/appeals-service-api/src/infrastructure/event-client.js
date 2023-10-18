const { getEventClient } = require('../event-client/event-client');
const config = require('../configuration/config.js');

const eventClient = getEventClient(config.serviceBus.serviceBusEnabled, config.serviceBus.hostname);

module.exports = eventClient;
