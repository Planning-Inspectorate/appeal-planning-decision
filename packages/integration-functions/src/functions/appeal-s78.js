/**
 * appeal-has
 * service bus topic trigger
 * consumes HAS appeal cases from BO
 */

const { app } = require('@azure/functions');
const config = require('../common/config');
const createApiClient = require('../common/api-client');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (message, context) => {
	context.debug('processing appeal-case message', message);

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

app.serviceBusTopic('appeals-s78', {
	topicName: config.AZURE.BO_SERVICEBUS.TOPIC_NAME.APPEAL_S78,
	subscriptionName: config.AZURE.BO_SERVICEBUS.SUBSCRIPTION_NAME.APPEAL_S78,
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
