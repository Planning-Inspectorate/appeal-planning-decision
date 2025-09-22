/**
 * Main
 *
 * This is the main starting point for the application. It
 * configures
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
			'document-service-api';
		appInsights.start();
	}
} catch (err) {
	logger.warn({ err }, 'Application insights failed to start: ');
}

const logger = require('./lib/logger');
const server = require('./server');

const main = async () => {
	server();
};

main().catch((err) => {
	logger.fatal({ err }, 'Unable to start application');
});
