const mongoose = require('mongoose');
const { healthcheck } = require('@pins/common');
const config = require('./config');
const logger = require('./logger');

const tasks = [
  {
    name: 'mongodb',
    test: async () => {
      const { ok } = await mongoose.connection.db.admin().ping();

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
      await mongoose.connection.close();
    },
    terminationGrace: config.server.terminationGracePeriod,
  });
