/**
 * appeal-service-user
 * service bus topic trigger
 */

const { app } = require('@azure/functions');
const config = require('../common/config');
const createApiClient = require('../common/api-client');
const { SERVICE_USER_TYPE, MESSAGE_EVENT_TYPE } = require('@planning-inspectorate/data-model');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (serviceUser, context) => {
	context.debug('Handle service user message', serviceUser);
	const client = await createApiClient();

	if (context?.triggerMetadata?.applicationProperties?.type === MESSAGE_EVENT_TYPE.DELETE) {
		if (serviceUser.serviceUserType === SERVICE_USER_TYPE.RULE_6_PARTY) {
			context.log('Sending unlink rule 6 party request to API');
			return await client.deleteR6UserAppealLink(serviceUser);
		}
		throw new Error('Invalid user type for delete message');
	}

	context.log('Sending service user request to API');
	return await client.putServiceUser(serviceUser); // API will validate the message and throw if there is an error
};

app.serviceBusTopic('serviceUser', {
	topicName: config.AZURE.BO_SERVICEBUS.TOPIC_NAME.APPEAL_SERVICE_USER,
	subscriptionName: config.AZURE.BO_SERVICEBUS.SUBSCRIPTION_NAME.APPEAL_SERVICE_USER,
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
