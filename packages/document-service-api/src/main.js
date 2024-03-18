/**
 * Main
 *
 * This is the main starting point for the application. It
 * configures
 */
const appInsights = require('applicationinsights');
const logger = require('./lib/logger');
const server = require('./server');

try {
	appInsights.setup().setAutoDependencyCorrelation(true, true).setSendLiveMetrics(true);
	appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] =
		'document-service-api';
	appInsights.start();
} catch (err) {
	logger.warn({ err }, 'Application insights failed to start: ');
}

const main = async () => {
	server();
};

main().catch((err) => {
	logger.fatal({ err }, 'Unable to start application');
});
