const http = require('http');

const config = require('./config');
const healthChecks = require('./lib/healthchecks');
const logger = require('./lib/logger');
const app = require('./app');

const {
  server: { port },
} = config;

module.exports = () => {
  const server = http.createServer(app);
  healthChecks(server);

  server.listen(port, () => {
    logger.info({ config }, 'Listening');
  });
};
