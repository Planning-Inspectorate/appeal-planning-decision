/**
 * appeal-event
 * service bus topic trigger
 * consumes events that occur on an appeal case e.g. a site visit
 */

const { app } = require('@azure/functions');
const createApiClient = require('../common/api-client');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (appealEvent, _context) => {
	const client = await createApiClient();
	return await client.putAppealEvent(appealEvent); // API will validate the message and throw if there is an error
};

app.serviceBusTopic('appeal-event', {
	topicName: 'appeal-event',
	subscriptionName: 'appeal-event-fo-sub',
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
