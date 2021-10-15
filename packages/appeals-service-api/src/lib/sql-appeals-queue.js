const container = require('rhea');
const config = require('./config');
const logger = require('./logger');

const options = config.messageQueue.sqlHASAppealsPublisher.connection;

function addAppeal(message) {
  container.connect(options).open_sender(config.messageQueue.sqlHASAppealsPublisher.queue);

  logger.info({ message }, 'SQL HAS queue');

  container.once('sendable', (context) => {
    context.sender.send({
      body: container.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
      content_type: 'application/json',
    });
    logger.info({ message }, 'Appeal message placed on SQL HAS queue');
  });

  container.on('accepted', (context) => {
    context.connection.close();
    logger.info(`SQL HAS Queue closed on message accepted`);
  });

  container.on('error', (err) => {
    logger.error({ err }, 'There was a problem with the SQL HAS queue');
  });
}

module.exports = {
  addAppeal,
};
