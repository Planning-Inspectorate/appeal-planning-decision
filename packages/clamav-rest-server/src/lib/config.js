/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required.
 */

module.exports = {
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: [
      'config.db.mongodb',
      'config.messageQueue.horizonHASPublisher.connection.password',
      'config.services.notify.apiKey',
    ],
  },
  server: {
    port: Number(process.env.SERVER_PORT || 3000),
    terminationGracePeriod: Number(
      (process.env.SERVER_TERMINATION_GRACE_PERIOD_SECONDS || 0) * 1000
    ),
  },
  services: {
    clamav: {
      host: process.env.CLAMAV_HOST,
      port: process.env.CLAMAV_PORT,
    },
    notify: {},
  },
};
