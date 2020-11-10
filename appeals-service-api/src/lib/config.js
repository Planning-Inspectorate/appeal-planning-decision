/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required
 */

module.exports = {
  data: {
    lpa: {
      listPath: process.env.LPA_DATA_PATH,
      trialistPath: process.env.LPA_TRIALIST_DATA_PATH,
    },
  },
  db: {
    mongodb: {
      url: process.env.MONGODB_URL,
      opts: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
    },
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: ['config.db.mongodb'],
  },
  server: {
    port: Number(process.env.SERVER_PORT || 3000),
    showErrors: process.env.SERVER_SHOW_ERRORS === 'true',
    terminationGracePeriod: Number(
      (process.env.SERVER_TERMINATION_GRACE_PERIOD_SECONDS || 0) * 1000
    ),
  },
};
