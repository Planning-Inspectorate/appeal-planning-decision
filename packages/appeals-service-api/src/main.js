/**
 * Main
 *
 * This is the main starting point for the application.
 */
const logger = require('./lib/logger');
const server = require('./server');
const mongodb = require('./db/db');

async function main() {
	console.log('STARTING THE APPPPPP!!!!');
	await mongodb.connect(() => {
		server();
	});
}

main().catch((err) => {
	logger.fatal({ err }, 'Unable to start application');
});

module.exports = main;
