/**
 * Main
 *
 * This is the main starting point for the application.
 */
const appInsights = require('applicationinsights');
const logger = require('./lib/logger');
const server = require('./server');
const mongodb = require('./db/db');

async function main() {
	try {
		appInsights.setup().setAutoDependencyCorrelation(true, true).setSendLiveMetrics(true);
		appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] =
			'appeals-service-api';
		appInsights.start();
	} catch (err) {
		logger.warn({ err }, 'Application insights failed to start: ');
	}

	await mongodb.connect(() => {
		server();
	});
}

main().catch((err) => {
	logger.fatal({ err }, 'Unable to start application');
});

module.exports = main;
