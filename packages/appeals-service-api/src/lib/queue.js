const container = require('rhea');
const config = require('./config');
const logger = require('./logger');

const options = config.messageQueue.horizonHASPublisher.connection;

function addAppeal(message) {
  container.connect(options).open_sender(config.messageQueue.horizonHASPublisher.queue);

  container.once('sendable', (context) => {
    context.sender.send({ body: message, content_type: 'application/json' });
    logger.debug(`Appeal message placed on queue \n Message = ${JSON.stringify(message)}`);
  });

  container.on('accepted', (context) => {
    context.connection.close();
    logger.debug(`Queue closed on message accepted`);
  });

  container.on('error', (error) => {
    logger.error(`There was a problem with the queue \n Error = ${error}`);
  });
}

module.exports = {
  addAppeal,
};
