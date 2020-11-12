module.exports = {
  appeals: {
    url: process.env.APPEALS_SERVICE_API_URL,
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: [],
  },
  server: {
    useSecureSessionCookie: process.env.USE_SECURE_SESSION_COOKIES === 'true',
  },
};
