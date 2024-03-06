const eventClient = require('../../infrastructure/event-client');
const { EventType } = require('../../event-client/event-type');
const config = require('../../configuration/config');

/**
 * @param {string} [topic]
 * @returns {(data: Array<unknown>) => Promise<Array<unknown>>}
 */
const forward = (topic) => async (data) => {
	if (!topic) throw new Error('Service Bus topic has not been configured in this environment');

	return await eventClient.sendEvents(topic, data, EventType.Create);
};

module.exports = {
	appeal: forward(config.serviceBus.topics.appellantSubmission),
	questionnaire: forward(config.serviceBus.topics.lpaSubmission)
};
