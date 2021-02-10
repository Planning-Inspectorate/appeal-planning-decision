const { healthcheck } = require('@pins/common');
const config = require('./config');
const logger = require('./logger');
const mongodb = require('../db/db');

const tasks = [
  {
    name: 'mongodb',
    test: async () => {
      const { ok } = await mongodb.get().admin().ping();

      return ok === 1;
    },
  },
];

module.exports = (server) =>
  healthcheck({
    server,
    tasks,
    logger,
    async onTerminate() {
      logger.info('Closing MongoDB connection');
      await mongodb.close();
    },
    terminationGrace: config.server.terminationGracePeriod,
  });
