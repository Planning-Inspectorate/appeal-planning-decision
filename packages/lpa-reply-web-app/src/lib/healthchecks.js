const { healthcheck } = require('@pins/common');
const logger = require('./logger');

module.exports = (server) =>
  healthcheck({
    server,
    logger,
    tasks: [],
  });
