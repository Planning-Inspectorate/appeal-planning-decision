const container = require('rhea');
const config = require('../lib/config');
const logger = require('../lib/logger');

function addAppeal(body) {
  const connection = container.connect({
    username: config.queue.username,
    password: config.queue.password,
    host: config.queue.host,
    port: config.queue.port,
  });

  logger.debug(`queue username = ${config.queue.name}`);
  logger.debug(`queue password = ${config.queue.password}`);

  connection.open_sender(config.queue.name);

  container.once('sendable', (context) => {
    context.sender.send({ body });
    context.connection.close();
  });
}

module.exports = {
  addAppeal,
};
