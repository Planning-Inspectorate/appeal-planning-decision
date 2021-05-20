const container = require('rhea');
const config = require('./config');
const logger = require('./logger');

const options = config.messageQueue.horizonHASPublisher.connection;

async function addAppealReply(message) {
  container.connect(options).open_sender(config.messageQueue.horizonHASPublisher.queue);

  container.once('sendable', (context) => {
    context.sender.send({
      body: container.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
      content_type: 'application/json',
    });
    logger.info({ message }, 'Appeal Reply message placed on queue');
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
  addAppealReply,
};
