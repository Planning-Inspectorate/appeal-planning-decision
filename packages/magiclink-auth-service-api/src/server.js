const http = require('http');
require('express-async-errors');

const config = require('./config');
const logger = require('./util/logger');
const app = require('./app');

const server = http.createServer(app);

server.listen(config.server.port, () => {
  logger.info({ config }, 'Listening');
});
