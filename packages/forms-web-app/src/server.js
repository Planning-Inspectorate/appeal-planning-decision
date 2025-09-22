#!/usr/bin/env node

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
			'web-front-end';
		appInsights.start();
	}
} catch (err) {
	logger.warn({ err }, 'Application insights failed to start: ');
}

const http = require('http');
const config = require('./config');
const app = require('./app');
const logger = require('./lib/logger');

/**
 * Get port from environment and store in Express.
 */
const { port } = config.server;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			logger.error({ port }, `App requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			logger.error({ port }, `Port already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	logger.info({ config }, 'Listening!');
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
