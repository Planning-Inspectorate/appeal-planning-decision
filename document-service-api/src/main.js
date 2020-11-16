/**
 * Main
 *
 * This is the main starting point for the application. It
 * configures
 */

const mongoose = require('mongoose');

const logger = require('./lib/logger');
const config = require('./lib/config');
const server = require('./server');

async function main() {
  /* Mongoose is a singleton internally, so connect before accepting connections */
  logger.info('Attempting to create Mongoose connection');
  await mongoose.connect(config.db.mongodb.url, config.db.mongodb.opts);
  logger.info('Connected to Mongoose');

  server();
}

main().catch((err) => {
  logger.fatal({ err }, 'Unable to start application');
});
