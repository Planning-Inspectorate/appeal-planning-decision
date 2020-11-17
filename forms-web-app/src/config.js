module.exports = {
  appeals: {
    timeout: Number(process.env.APPEALS_SERVICE_API_TIMEOUT || 10000),
    url: process.env.APPEALS_SERVICE_API_URL,
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: ['opts.body'],
  },
  redis: () => {
    const redisConfig = {
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASS,
      port: Number(process.env.REDIS_PORT || 6379),
    };

    if (process.env.REDIS_USE_TLS === 'true') {
      redisConfig.tls = {
        servername: process.env.REDIS_HOST,
      };
    }

    return redisConfig;
  },
  server: {
    port: Number(process.env.PORT || 3000),
    sessionSecret: process.env.SESSION_KEY,
    useSecureSessionCookie: process.env.USE_SECURE_SESSION_COOKIES === 'true',
  },
};
