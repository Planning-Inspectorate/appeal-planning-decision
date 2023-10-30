const eventClient = require('../infrastructure/event-client');
const { EventType } = require('../event-client/event-type');

const broadcast = async (data) => {
	return await eventClient.sendEvents('appeal', data, EventType.Create);
};

module.exports = { broadcast };
