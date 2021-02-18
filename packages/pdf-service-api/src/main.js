/**
 * Main
 *
 * This is the main starting point for the application. It
 * configures
 */
const logger = require('./lib/logger');
const server = require('./server');

async function main() {
  server();
}

main().catch((err) => {
  logger.fatal({ err }, 'Unable to start application');
});
