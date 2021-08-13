process.env.MAGIC_LINK_CRYPTO_KEY = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
process.env.MAGIC_LINK_JWT_KEY = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
process.env.MAGIC_LINK_EXPIRY_TIME = 1912235086000;
process.env.JWT_COOKIE_MAX_AGE = 10000;
process.env.SRV_NOTIFY_BASE_URL = 'http://localhost:5001';
process.env.SRV_NOTIFY_SERVICE_ID = 'dummy-service-id-for-notify';
process.env.SRV_NOTIFY_API_KEY = 'dummy-api-key-for-notify';

const http = require('http');
require('express-async-errors');

const config = require('./config');
const logger = require('./util/logger');
const app = require('./app');

const server = http.createServer(app);

server.listen(config.server.port, () => {
  logger.info({ config }, 'Listening');
});
