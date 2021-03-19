/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required
 */

module.exports = {
  logger: {
    level: process.env.LOGGER_LEVEL || 'debug',
    redact: ['config.messageQueue.*.connection.password'],
  },
  messageQueue: {
    horizonHASPublisher: {
      connection: {
        host: process.env.HORIZON_HAS_PUBLISHER_HOST,
        password: process.env.HORIZON_HAS_PUBLISHER_PASSWORD,
        username: process.env.HORIZON_HAS_PUBLISHER_USERNAME,
      },
      queues: (process.env.HORIZON_HAS_PUBLISHER_QUEUES || '').split(',').filter((item) => item),
    },
  },
  server: {
    port: Number(process.env.SERVER_PORT || 3000),
  },
};
