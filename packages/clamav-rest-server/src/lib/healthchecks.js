const { healthcheck } = require('@pins/common');
const config = require('./config');
const logger = require('./logger');

const tasks = [
  {
    name: 'clamav',
    test: 1,
  },
];

module.exports = (server) =>
  healthcheck({
    server,
    tasks,
    logger,
    terminationGrace: config.server.terminationGracePeriod,
  });
