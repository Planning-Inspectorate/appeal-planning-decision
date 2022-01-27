const rhea = require('rhea');
const config = require('./config');
const logger = require('./logger');

const options = config.messageQueue.horizonHASPublisher.connection;
const horizonContainer = rhea.create_container({ id: 'horizon-appeal-publish-container' });
const sqlContainer = rhea.create_container({ id: 'sql-appeal-publish-container-1' });

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

  sqlContainer.connect(options).open_sender(config.messageQueue.sqlHASAppealsPublisher.queue);

  sqlContainer.once('sendable', (context) => {
    context.sender.send({
      body: sqlContainer.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
      content_type: 'application/json',
    });
    logger.info({ message }, 'Appeal message placed on SQL queue');
  });

  sqlContainer.on('accepted', (context) => {
    context.connection.close();
    logger.info(`SQL ueue closed on message accepted`);
  });

  sqlContainer.on('error', (err) => {
    logger.error({ err }, 'There was a problem with the SQL queue');
  });
}

module.exports = {
  addAppeal,
};
