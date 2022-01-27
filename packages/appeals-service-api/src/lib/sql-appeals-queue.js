const rhea = require('rhea');
const config = require('./config');
const logger = require('./logger');

const options = config.messageQueue.sqlHASAppealsPublisher.connection;
const sqlContainer = rhea.create_container({ id: 'sql-appeal-publish-container-2' });

function addAppeal(message) {
  sqlContainer.connect(options).open_sender(config.messageQueue.sqlHASAppealsPublisher.queue);

  logger.info({ message }, 'SQL HAS queue initialisation');

  sqlContainer.once('sendable', (context) => {
    context.sender.send({
      body: sqlContainer.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
      content_type: 'application/json',
    });
    logger.info({ message }, 'Appeal message placed on SQL HAS queue');
  });

  sqlContainer.on('accepted', (context) => {
    context.connection.close();
    logger.info(`SQL HAS Queue closed on message accepted`);
  });

  sqlContainer.on('error', (err) => {
    logger.error({ err }, 'There was a problem with the SQL HAS queue');
  });
}

module.exports = {
  addAppeal,
};
