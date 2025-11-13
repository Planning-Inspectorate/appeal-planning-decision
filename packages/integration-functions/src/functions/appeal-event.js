/**
 * appeal-event
 * service bus topic trigger
 * consumes events that occur on an appeal case e.g. a site visit
 */

const { app } = require('@azure/functions');
const config = require('../common/config');
const createApiClient = require('../common/api-client');
const { MESSAGE_EVENT_TYPE } = require('@planning-inspectorate/data-model');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (appealEvent, context) => {
	const client = await createApiClient();

	if (eventShouldBeDeleted(context)) {
		context.log('Sending delete event request to API');
		await client.deleteAppealEvent(appealEvent.eventId);
		context.log(`Finished deleting: ${appealEvent.eventId}`);
		return {};
	}

	return await client.putAppealEvent(appealEvent); // API will validate the message and throw if there is an error
};

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @returns {boolean}
 */
const eventShouldBeDeleted = (context) =>
	context?.triggerMetadata?.applicationProperties?.type === MESSAGE_EVENT_TYPE.DELETE;

app.serviceBusTopic('appeal-event', {
	topicName: config.AZURE.BO_SERVICEBUS.TOPIC_NAME.APPEAL_EVENT,
	subscriptionName: config.AZURE.BO_SERVICEBUS.SUBSCRIPTION_NAME.APPEAL_EVENT,
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
