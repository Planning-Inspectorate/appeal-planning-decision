const { healthcheck } = require('@pins/common');
const config = require('./config');
const logger = require('./logger');

const tasks = [];

module.exports = (server) =>
  healthcheck({
    server,
    tasks,
    logger,
    terminationGrace: config.server.terminationGracePeriod,
  });
