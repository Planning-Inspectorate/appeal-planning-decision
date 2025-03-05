/**
 * appeal-service-user
 * service bus topic trigger
 */

const { app } = require('@azure/functions');
const createApiClient = require('../common/api-client');
const { SERVICE_USER_TYPE } = require('pins-data-model');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (serviceUser, context) => {
	context.debug('Handle service user message', serviceUser);
	const client = await createApiClient();

	if (rule6PartyStatusRevocation(serviceUser, context)) {
		context.log('Sending delete rule 6 party request to API');
		return await client.deleteServiceUser(serviceUser);
	}

	context.log('Sending service user request to API');
	return await client.putServiceUser(serviceUser); // API will validate the message and throw if there is an error
};

const rule6PartyStatusRevocation = (serviceUser, context) => {
	return (
		serviceUser.serviceUserType === SERVICE_USER_TYPE.RULE_6_PARTY &&
		context?.triggerMetadata?.applicationProperties?.type === 'Delete'
	);
};

app.serviceBusTopic('serviceUser', {
	topicName: 'appeal-service-user',
	subscriptionName: 'appeal-service-user-fo-sub',
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
