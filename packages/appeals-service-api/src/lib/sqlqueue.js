const container = require('rhea');
const config = require('./config');
const logger = require('./logger');

const options = config.messageQueue.sqlAppealsPublisher.connection;

function addAppeal(message) {
  container.connect(options).open_sender(config.messageQueue.sqlAppealsPublisher.queue);

  container.once('sendable', (context) => {
    context.sender.send({
      body: container.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
      content_type: 'application/json',
    });
    logger.info({ message }, 'Appeal message placed on SQL appeals queue');
  });

  container.on('accepted', (context) => {
    context.connection.close();
    logger.info(`SQL appeals queue closed on message accepted`);
  });

  container.on('error', (err) => {
    logger.error({ err }, 'There was a problem with the SQL appeals queue');
  });
}

module.exports = {
  addAppeal,
};
