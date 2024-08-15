/**
 * app maintenance timer trigger
 * timer to trigger weekly data cleanse
 */

const { app } = require('@azure/functions');
const createApiClient = require('../common/api-client');
const config = require('../common/config');

/**
 * @param {import('@azure/functions').Timer} timer
 * @param {import('@azure/functions').InvocationContext} context
 * @returns {Promise<void>}
 */
const handler = async (timer, context) => {
	try {
		context.log('Starting data cleanup process');
		const client = await createApiClient();
		const result = await client.cleanupOldSubmissions();
		context.log('Data cleanup completed successfully:', result);
	} catch (error) {
		context.log('Error during data cleanup:', error.message);
		throw new Error('Error deleting old submissions');
	} finally {
		context.log('Timer object:', timer);
	}
};

app.timer('run-maintenance', {
	schedule: config.timer.schedule,
	handler: handler
});

module.exports = handler;
