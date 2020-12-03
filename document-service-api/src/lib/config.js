/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required
 */

module.exports = {
  AZURE_BLOB_STORAGE_CONNECTION_STRING: process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING,
  documentStorage: {
    directory: process.env.DOCUMENT_STORAGE_DIR
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
  },
};
