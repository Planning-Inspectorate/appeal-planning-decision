/**
 * Main
 *
 * This is the main starting point for the application.
 */
import appInsights from 'applicationinsights';
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
			'appeals-auth-server';
		appInsights.start();
	}
} catch (err) {
	console.warn('Application insights failed to start:', err);
}

async function main() {
	const [{ default: logger }, { default: server }] = await Promise.all([
		import('./lib/logger.js'),
		import('./server.js')
	]);

	try {
		server();
	} catch (err) {
		logger.fatal({ err }, 'Unable to start application');
		throw err;
	}
}

main().catch((err) => {
	// Fallback if logger failed to load
	console.error('Unable to start application', err);
	process.exit(1);
});

export default main;
