/**
 * appeal-group-c
 * service bus topic trigger
 * consumes generic (Group C) appeal cases from BO
 */

const { app } = require('@azure/functions');
const config = require('../common/config');
const createApiClient = require('../common/api-client');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (message, context) => {
	context.debug('processing group-c appeal-case message', message);

	if (!Object.hasOwn(message, 'caseReference')) {
		throw new Error('invalid message, caseReference is required');
	}

	if (config.API.HOSTNAME === undefined) {
		throw new Error('process.env.FO_APPEALS_API_HOSTNAME not set');
	}

	const client = await createApiClient();
	await client.putAppealCase(message); // API will validate the message and throw if there is an error

	return {};
};

app.serviceBusTopic('appeals-group-c', {
	topicName: config.AZURE.BO_SERVICEBUS.TOPIC_NAME.APPEAL_GROUP_C,
	subscriptionName: config.AZURE.BO_SERVICEBUS.SUBSCRIPTION_NAME.APPEAL_GROUP_C,
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
