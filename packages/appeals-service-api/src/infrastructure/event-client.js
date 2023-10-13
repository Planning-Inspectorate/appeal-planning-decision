const { getEventClient } = require('../event-client/event-client');
const config = require('../configuration/config.js');
const logger = require('../lib/logger.js');

const eventClient = getEventClient(
	config.serviceBus.serviceBusEnabled,
	logger,
	config.serviceBusOptions?.hostname
);

module.exports = eventClient;
