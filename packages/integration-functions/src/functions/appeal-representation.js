/**
 * appeal-representation
 * service bus topic trigger
 * consumes events that occur on an appeal case e.g. a site visit
 */

const { app } = require('@azure/functions');
const config = require('../common/config');
const createApiClient = require('../common/api-client');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (appealRepresentation, _context) => {
	const client = await createApiClient();
	return await client.putAppealRepresentation(appealRepresentation); // API will validate the message and throw if there is an error
};

app.serviceBusTopic('appeal-representation', {
	topicName: config.AZURE.BO_SERVICEBUS.TOPIC_NAME.APPEAL_REPRESENTATION,
	subscriptionName: config.AZURE.BO_SERVICEBUS.SUBSCRIPTION_NAME.APPEAL_REPRESENTATION,
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
