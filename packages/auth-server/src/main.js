/**
 * Main
 *
 * This is the main starting point for the application.
 */
import appInsights from 'applicationinsights';

import { getLogger } from './lib/logger.js';
import config from './configuration/config.js';

import server from './server.js';

const logger = getLogger(config);

async function main() {
	try {
		appInsights.setup().setAutoDependencyCorrelation(true, true).setSendLiveMetrics(true);
		appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] =
			'appeals-auth-server';
		appInsights.start();
	} catch (err) {
		logger.warn({ err }, 'Application insights failed to start: ');
	}

	server({ config, logger });
}

main().catch((err) => {
	logger.fatal({ err }, 'Unable to start application');
});

export default main;
