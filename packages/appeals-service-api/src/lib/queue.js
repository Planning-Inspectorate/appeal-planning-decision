const container = require('rhea');
const containerSQL = require('rhea');
const config = require('./config');
const logger = require('./logger');

const options = config.messageQueue.horizonHASPublisher.connection;

function addAppeal(message) {
  container.connect(options).open_sender(config.messageQueue.horizonHASPublisher.queue);

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

  containerSQL.connect(options).open_sender(config.messageQueue.sqlHASAppealsPublisher.queue);

  containerSQL.once('sendable', (context) => {
    context.sender.send({
      body: container.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
      content_type: 'application/json',
    });
    logger.info({ message }, 'Appeal message placed on SQL queue');
  });

  containerSQL.on('accepted', (context) => {
    context.connection.close();
    logger.info(`SQL ueue closed on message accepted`);
  });

  containerSQL.on('error', (err) => {
    logger.error({ err }, 'There was a problem with the SQL queue');
  });
}

module.exports = {
  addAppeal,
};
