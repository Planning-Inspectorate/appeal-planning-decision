/**
 * appeal-representation
 * service bus topic trigger
 * consumes events that occur on an appeal case e.g. a site visit
 */

const { app } = require('@azure/functions');
const createApiClient = require('../common/api-client');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (appealRepresentation, _context) => {
	const client = await createApiClient();
	return await client.putAppealRepresentation(appealRepresentation); // API will validate the message and throw if there is an error
};

app.serviceBusTopic('appeal-representation', {
	topicName: 'appeal-representation',
	subscriptionName: 'appeal-representation-fo-sub',
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
