const rhea = require('rhea');
const config = require('./config');
const logger = require('./logger');

const options = config.messageQueue.horizonHASPublisher.connection;
const horizonContainer = rhea.create_container({ id: 'horizon-appeal-publish-container' });

function addAppeal(message) {
  horizonContainer.connect(options).open_sender(config.messageQueue.horizonHASPublisher.queue);

  horizonContainer.once('sendable', (context) => {
    context.sender.send({
      body: horizonContainer.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
      content_type: 'application/json',
    });
    logger.info({ message }, 'Appeal message placed on queue');
  });

  horizonContainer.on('accepted', (context) => {
    context.connection.close();
    logger.info(`Queue closed on message accepted`);
  });

  horizonContainer.on('error', (err) => {
    logger.error({ err }, 'There was a problem with the queue');
  });
}

module.exports = {
  addAppeal,
};
