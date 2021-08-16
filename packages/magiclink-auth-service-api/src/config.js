module.exports = {
  server: {
    port: Number(process.env.SERVER_PORT || 3009),
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'debug',
    redact: ['opts.body', 'config.db.session.uri', 'config.server.sessionSecret'],
  },
  notify: {
    baseUrl: process.env.SRV_NOTIFY_BASE_URL,
    serviceId: process.env.SRV_NOTIFY_SERVICE_ID,
    apiKey: process.env.SRV_NOTIFY_API_KEY,
    templateId: process.env.MAGIC_LINK_TEMPLATE_ID,
  },
  dataEncryptionKey: process.env.DATA_ENCRYPTION_KEY,
  jwtSigningKey: process.env.JWT_SIGNING_KEY,
  magicLinkValidityTimeMillis: Number(process.env.MAGIC_LINK_VALIDITY_TIME_MILLIS),
  cookieValidityTimeMillis: Number(process.env.COOKIE_VALIDITY_TIME_MILLIS),
};
