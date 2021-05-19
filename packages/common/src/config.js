/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required
 */

module.exports = {
  cookies: {
    expiresTimerInMilliseconds: Number(
      process.env.COOKIE_EXPIRES_TIMER_IN_MS || 365 * 24 * 60 * 60 * 1000
    ),
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: ['config.services.notify.apiKey'],
  },
  isProduction: process.env.NODE_ENV === 'production',
  services: {
    notify: {
      baseUrl: process.env.SRV_NOTIFY_BASE_URL,
      serviceId: process.env.SRV_NOTIFY_SERVICE_ID,
      apiKey: process.env.SRV_NOTIFY_API_KEY,
    },
  },
};
