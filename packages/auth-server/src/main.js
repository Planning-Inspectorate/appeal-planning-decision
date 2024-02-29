/**
 * Main
 *
 * This is the main starting point for the application.
 */
import appInsights from 'applicationinsights';

import logger from './lib/logger.js';
import server from './server.js';

async function main() {
	try {
		appInsights.setup().setAutoDependencyCorrelation(true, true).setSendLiveMetrics(true);
		appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] =
			'appeals-auth-server';
		appInsights.start();
	} catch (err) {
		logger.warn({ err }, 'Application insights failed to start: ');
	}

	server();
}

main().catch((err) => {
	logger.fatal({ err }, 'Unable to start application');
});

export default main;
