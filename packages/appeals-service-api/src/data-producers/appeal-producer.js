const eventClient = require('../infrastructure/event-client');
const { EventType } = require('../event-client/event-type');

/**
 * @param {Array<*>} data
 * @returns {Promise<Array<*>>}
 */
const broadcast = async (data) => {
	return await eventClient.sendEvents('appeal-fo-appellant-submission', data, EventType.Create);
};

module.exports = { broadcast };
