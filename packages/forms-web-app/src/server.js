#!/usr/bin/env node

/**
 * Module dependencies.
 */
const http = require('http');
const config = require('./config');
const app = require('./app');
const logger = require('./lib/logger');
const healthChecks = require('./lib/healthchecks');

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
 * Add healthchecks
 */

healthChecks(server);

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
