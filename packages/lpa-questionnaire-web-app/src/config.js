// const oneGigabyte = 1024 * 1024 * 1024;

module.exports = {
  appeals: {
    timeout: Number(process.env.APPEALS_SERVICE_API_TIMEOUT || 10000),
    url: process.env.APPEALS_SERVICE_API_URL,
  },
  db: {
    session: {
      uri: process.env.SESSION_MONGODB_URL,
      databaseName: process.env.SESSION_MONGODB_DB_NAME,
      collection: process.env.SESSION_MONGODB_COLLECTION || 'sessions',
      expiresColumn: '_ts',
      expires: 1000 * 60 * 60 * 24 * 14, // value in milliseconds
      expiresAfterSeconds: 60 * 60 * 24 * 14, // value in seconds
      connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  },
  documents: {
    timeout: Number(process.env.DOCUMENTS_SERVICE_API_TIMEOUT || 10000),
    url: process.env.DOCUMENTS_SERVICE_API_URL,
  },
  fileUpload: {
    debug: process.env.FILE_UPLOAD_DEBUG === 'true',
    pins: {
      // appealStatementMaxFileSize: Number(
      //   process.env.FILE_UPLOAD_MAX_FILE_SIZE_BYTES || oneGigabyte
      // ),
    },
    tempFileDir: process.env.FILE_UPLOAD_TMP_PATH,
    useTempFiles: process.env.FILE_UPLOAD_USE_TEMP_FILES === 'true',
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: ['opts.body', 'config.db.session.uri', 'config.server.sessionSecret'],
  },
  appealReply: {
    timeout: Number(process.env.APPEAL_REPLY_SERVICE_API_TIMEOUT || 10000),
    url: process.env.APPEAL_REPLY_SERVICE_API_URL,
  },
  server: {
    port: Number(process.env.PORT || 3000),
    sessionSecret: process.env.SESSION_KEY,
    useSecureSessionCookie: process.env.USE_SECURE_SESSION_COOKIES === 'true',
    googleAnalyticsId: '',
  },
};
