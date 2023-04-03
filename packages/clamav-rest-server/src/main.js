/**
 * Main
 *
 * This is the main starting point for the application.
 */
const appInsights = require('applicationinsights');
const logger = require('./lib/logger');
const server = require('./server');

async function main() {
	try {
		appInsights.setup().setAutoDependencyCorrelation(true).setSendLiveMetrics(true).start();
		appInsights.defaultClient.setAutoPopulateAzureProperties(true);
	} catch (err) {
		logger.warn({ err }, 'Application insights failed to start: ');
	}
	server();
}

main().catch((err) => {
	logger.fatal({ err }, 'Unable to start application');
});
