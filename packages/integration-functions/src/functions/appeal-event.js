/**
 * appeal-event
 * service bus topic trigger
 * consumes events that occur on an appeal case e.g. a site visit
 */

const { app } = require('@azure/functions');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (message, context) => {
	context.log('Handle event message', message);

	throw new Error('not implemented');
};

app.serviceBusTopic('appeal-event', {
	topicName: 'appeal-event',
	subscriptionName: 'appeal-event-fo-sub',
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
