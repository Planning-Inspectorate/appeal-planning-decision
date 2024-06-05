/**
 * listed-building
 * service bus topic trigger
 * temporarily pointing to a topic controlled by appeals, this will eventually be replaced by one provided in a different infra stack and provided by ODW
 * sends onto api which will in turn add to DB
 */

const got = require('got');

const { app } = require('@azure/functions');

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (message, context) => {
	context.log('Handle listed building message', message);

	if (Array.isArray(message)) {
		await processListedBuilding(message);
		return;
	}

	await processListedBuilding([message]);

	return {};
};

/**
 * @param {Array<Object>} listedBuildingMessages
 */
async function processListedBuilding(listedBuildingMessages) {
	// todo: use api client
	const APPEALS_CASE_DATA_URL = `https://${process.env.FO_APPEALS_API}/listed-buildings`;
	await got
		.put(APPEALS_CASE_DATA_URL, {
			json: listedBuildingMessages
		})
		.json();
}

app.serviceBusTopic('listedBuilding', {
	topicName: 'listed-building',
	subscriptionName: 'listed-building-fo-sub',
	connection: 'ServiceBusConnection',
	cardinality: 'many',
	handler: handler
});

module.exports = handler;
