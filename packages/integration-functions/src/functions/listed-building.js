/**
 * listed-building
 * service bus topic trigger
 * temporarily pointing to a topic controlled by appeals, this will eventually be replaced by one provided in a different infra stack and provided by ODW
 * sends onto api which will in turn add to DB
 */

const { app } = require('@azure/functions');
const config = require('../common/config');
const createApiClient = require('../common/api-client');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (message) => {
	const client = await createApiClient();
	return await client.putListedBuildings(message);
};

app.serviceBusTopic('listedBuilding', {
	topicName: config.AZURE.BO_SERVICEBUS.TOPIC_NAME.LISTED_BUILDING,
	subscriptionName: config.AZURE.BO_SERVICEBUS.SUBSCRIPTION_NAME.LISTED_BUILDING,
	connection: 'ServiceBusConnection',
	cardinality: 'many',
	handler: handler
});

module.exports = handler;
