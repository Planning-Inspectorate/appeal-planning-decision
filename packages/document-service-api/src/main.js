/**
 * Main
 *
 * This is the main starting point for the application. It
 * configures
 */
const appInsights = require('applicationinsights');
const main = require('./lib/mongooseBootstrap');
const logger = require('./lib/logger');
const server = require('./server');

main()
	.then(() => initInsights())
	.then(() => server())
	.catch((err) => {
		logger.fatal({ err }, 'Unable to start application');
		process.exit(1);
	});

function initInsights() {
	try {
		appInsights.setup().setAutoDependencyCorrelation(true).setSendLiveMetrics(true).start();
		appInsights.defaultClient.setAutoPopulateAzureProperties(true);
	} catch (err) {
		logger.warn({ err }, 'Application insights failed to start: ');
	}
}
