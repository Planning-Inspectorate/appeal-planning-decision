const { create_container: createContainer } = require('rhea');

module.exports = class MessageQueue {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;

    this.container = createContainer();

    this.connectionHealth = {
      sender: false,
    };

    this.configureListeners();
    this.startListening();
  }

  configureListeners() {
    this.container
      .on('disconnected', ({ error }) => {
        this.logger.fatal({ err: error }, 'AMQP connection disconnected');
        this.connectionHealth.sender = false;
      })
      .on('error', (err) => {
        this.logger.error(
          {
            err: {
              message: err.message,
            },
          },
          'AMQP general error'
        );
      })
      .on('sendable', (ctx) => {
        this.sender = ctx;
        this.connectionHealth.sender = true;
        this.logger.info('Reply queue now sendable');
      })
      .on('sender_close', () => {
        this.logger.debug('Sender closed');
        this.connectionHealth.sender = false;
      })
      .on('sender_error', ({ error }) => {
        this.logger.error({ err: error }, 'Sender error');
        this.connectionHealth.sender = false;
      });
  }

  startListening() {
    const connection = this.container.connect(this.config.connection);

    connection.open_sender(this.config.queue);
  }

  async send(data, contentType = 'application/json') {
    // @todo need to check that the message queue is ready for messages
    this.logger.info('Sending message to queue');

    this.sender.sender.send({
      data,
      content_type: contentType,
    });
  }
};
