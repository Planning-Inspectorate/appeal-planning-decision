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
    templateId: process.env.SRV_NOTIFY_TEMPLATE_ID || '1cd00f93-9814-44b5-99db-97382b38cf13',
  },
  cryptoKey: process.env.MAGIC_LINK_CRYPTO_KEY,
  jwtKey: process.env.MAGIC_LINK_JWT_KEY,
  magicLink: {
    expiryTime: Number(process.env.MAGIC_LINK_EXPIRY_TIME),
  },
  cookie: {
    name: process.env.JWT_COOKIE_NAME || 'jwtCookie',
    maxAge: process.env.JWT_COOKIE_MAX_AGE,
  },
};
