const container = require('rhea');
const config = require('./config');
const logger = require('./logger');

const options = config.messageQueue.horizonHASPublisher.connection;

function addAppeal(message) {
  container.connect(options).open_sender(config.messageQueue.horizonHASPublisher.queue);

  container.once('sendable', (context) => {
    context.sender.send({ body: message, content_type: 'application/json' });
    logger.debug({ message }, 'Appeal message placed on queue');
  });

  container.on('accepted', (context) => {
    context.connection.close();
    logger.debug(`Queue closed on message accepted`);
  });

  container.on('error', (err) => {
    logger.error({ err }, 'There was a problem with the queue');
  });
}

module.exports = {
  addAppeal,
};
