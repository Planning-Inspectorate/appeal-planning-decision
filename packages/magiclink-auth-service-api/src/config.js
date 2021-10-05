const httpPort = Number(process.env.PORT || 3009);

module.exports = {
  server: { port: httpPort },
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
  /**
   * Optional variable used for constructing the magic link URL that is sent via email.
   * If the env variable is not defined, then the magic link URL is constructed dynamically using the API protocol and host.
   *
   * The main purpose of this configuration is to help with local testing. When the service runs inside the docker container
   * the API host name is not 'localhost' but the name of the container which is accessible only from the docker compose network.
   */
  magicLinkURL: process.env.MAGIC_LINK_API_URL,
};
