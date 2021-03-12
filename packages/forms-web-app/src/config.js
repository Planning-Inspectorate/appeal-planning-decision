const oneGigabyte = 1024 * 1024 * 1024;
const httpPort = Number(process.env.PORT || 3000);

module.exports = {
  appeals: {
    startingPoint:
      process.env.SERVER_LIMITED_ROUTING_ENABLED === 'true'
        ? '/eligibility/decision-date'
        : '/before-you-appeal',
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
  pdf: {
    url: process.env.PDF_SERVICE_API_URL,
  },
  fileUpload: {
    debug: process.env.FILE_UPLOAD_DEBUG === 'true',
    pins: {
      appealStatementMaxFileSize: Number(
        process.env.FILE_UPLOAD_MAX_FILE_SIZE_BYTES || oneGigabyte
      ),
      supportingDocumentsMaxFileSize: Number(
        process.env.FILE_UPLOAD_MAX_FILE_SIZE_BYTES || oneGigabyte
      ),
      uploadApplicationMaxFileSize: Number(
        process.env.FILE_UPLOAD_MAX_FILE_SIZE_BYTES || oneGigabyte
      ),
      uploadDecisionMaxFileSize: Number(process.env.FILE_UPLOAD_MAX_FILE_SIZE_BYTES || oneGigabyte),
    },
    tempFileDir: process.env.FILE_UPLOAD_TMP_PATH,
    useTempFiles: process.env.FILE_UPLOAD_USE_TEMP_FILES === 'true',
  },
  isProduction: process.env.NODE_ENV === 'production',
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: ['opts.body', 'config.db.session.uri', 'config.server.sessionSecret'],
  },
  server: {
    limitedRouting: {
      enabled: process.env.SERVER_LIMITED_ROUTING_ENABLED === 'true',
      /* Strings and regex are both allowable */
      allowedRoutes: [
        '/',
        '/eligibility/decision-date',
        '/eligibility/decision-date-passed',
        '/eligibility/no-decision',
        // These must be in to ensure the application runs correctly
        '/health',
        '/metrics',
        /^\/assets\//i,
        /^\/public\//i,
      ],
      serviceUrl: 'https://acp.planninginspectorate.gov.uk',
    },
    host: process.env.HOST_URL || `http://localhost:${httpPort}`, // This is used for the HTML generator
    port: httpPort,
    sessionSecret: process.env.SESSION_KEY,
    // https://expressjs.com/en/5x/api.html#app.set - to account for .gov.uk
    subdomainOffset: process.env.SUBDOMAIN_OFFSET || 3,
    useSecureSessionCookie: process.env.USE_SECURE_SESSION_COOKIES === 'true',
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
  },
};
