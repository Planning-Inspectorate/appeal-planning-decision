/**
 * appeal-service-user
 * service bus topic trigger
 */

const { app } = require('@azure/functions');
const createApiClient = require('../common/api-client');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (serviceUser) => {
	const client = await createApiClient();
	return await client.putServiceUser(serviceUser); // API will validate the message and throw if there is an error
};

app.serviceBusTopic('serviceUser', {
	topicName: 'appeal-service-user',
	subscriptionName: 'appeal-service-user-fo-sub',
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
