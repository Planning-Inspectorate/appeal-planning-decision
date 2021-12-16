const http = require('http');
require('express-async-errors');

const config = require('./lib/config');
const healthChecks = require('./lib/healthchecks');
const logger = require('./lib/logger');

const app = require('./app');

module.exports = () => {
  const server = http.createServer(app);
  healthChecks(server);

  server.listen(config.server.port, () => {
    logger.info({ config }, 'Listening');
  });
};
