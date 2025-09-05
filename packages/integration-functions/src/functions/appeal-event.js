/**
 * appeal-event
 * service bus topic trigger
 * consumes events that occur on an appeal case e.g. a site visit
 */

const { app } = require('@azure/functions');
const config = require('../common/config');
const createApiClient = require('../common/api-client');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (appealEvent, _context) => {
	const client = await createApiClient();
	return await client.putAppealEvent(appealEvent); // API will validate the message and throw if there is an error
};

app.serviceBusTopic('appeal-event', {
	topicName: config.AZURE.BO_SERVICEBUS.TOPIC_NAME.APPEAL_EVENT,
	subscriptionName: config.AZURE.BO_SERVICEBUS.SUBSCRIPTION_NAME.APPEAL_EVENT,
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
