/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required
 */
const ONE_MEGABYTE = 1024 * 1024;

module.exports = {
  azure: {
    BLOB_STORAGE_CONNECTION_STRING: process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING,
    BLOB_STORAGE_CONTAINER_NAME: 'documentservice'
  },
  documentStorage: {
    directory: process.env.DOCUMENT_STORAGE_DIR,
    maxFileSizeInBytes: 50 * ONE_MEGABYTE
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
