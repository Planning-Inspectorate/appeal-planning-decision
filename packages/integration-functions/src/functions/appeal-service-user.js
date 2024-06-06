/**
 * appeal-service-user
 * service bus topic trigger
 */

const { app } = require('@azure/functions');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (message, context) => {
	context.log('Handle service user message', message);

	throw new Error('not implemented');
};

app.serviceBusTopic('serviceUser', {
	topicName: 'appeal-service-user',
	subscriptionName: 'appeal-service-user-fo-sub',
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
