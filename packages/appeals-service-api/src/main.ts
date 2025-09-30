/**
 * Main
 *
 * This is the main starting point for the application.
 */
const appInsights = require('applicationinsights');
try {
	if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
		appInsights
			.setup()
			.setAutoDependencyCorrelation(true)
			.setAutoCollectRequests(true)
			.setAutoCollectDependencies(true)
			.setAutoCollectExceptions(true)
			.setSendLiveMetrics(true);

		appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] =
			'appeals-service-api';
		appInsights.start();
	}
} catch (err) {
	console.warn({ err }, 'Application insights failed to start: ');
}

const logger = require('./lib/logger');
const server = require('./server');
const mongodb = require('./db/db');
const { setupIndexes } = require('./db/setup');

async function main() {
	mongodb.connect(async () => {
		await setupIndexes();
		server();
	});
}

main().catch((err) => {
	logger.fatal({ err }, 'Unable to start application');
});

module.exports = main;
