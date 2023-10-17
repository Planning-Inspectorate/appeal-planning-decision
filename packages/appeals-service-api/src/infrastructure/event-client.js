const { getEventClient } = require('../event-client/event-client');
const config = require('../configuration/config.js');
const logger = require('../lib/logger.js');

const eventClient = getEventClient(
	config.serviceBus.serviceBusEnabled,
	logger,
	config.serviceBus.hostname
);

module.exports = eventClient;
