/**
 * Main
 *
 * This is the main starting point for the application. It
 * configures
 */

const main = require('./lib/mongooseBootstrap');
const logger = require('./lib/logger');
const server = require('./server');

main()
	.then(() => server())
	.catch((err) => {
		logger.fatal({ err }, 'Unable to start application');
		process.exit(1);
	});
