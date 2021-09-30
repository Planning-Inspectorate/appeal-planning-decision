const logger = require('./lib/logger');
const server = require('./server');

const main = async () => {
  server();
};

main().catch((err) => {
  logger.fatal({ err }, 'Unable to start application');
});
