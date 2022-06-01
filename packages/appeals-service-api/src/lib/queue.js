const container = require('rhea');
const config = require('./config');
const logger = require('./logger');

const options = config.messageQueue.horizonHASPublisher.connection;

function addAppeal(message) {
  try {
    container.connect(options).open_sender(config.messageQueue.horizonHASPublisher.queue);
  } catch (err) {
    logger.error({ err }, 'Cannot connect to the queue');
  }

  container.once('sendable', (context) => {
    context.sender.send({
      body: container.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
      content_type: 'application/json',
    });
    logger.info({ message }, 'Appeal message placed on queue');
  });

  container.on('accepted', (context) => {
    context.connection.close();
    logger.info(`Queue closed on message accepted`);
  });

  container.on('error', (err) => {
    logger.error({ err }, 'There was a problem with the queue');
  });
}

module.exports = {
  addAppeal,
};
