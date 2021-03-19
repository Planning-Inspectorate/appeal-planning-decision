const { ServiceBusClient } = require('@azure/service-bus');

module.exports = class Queue {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect(connectionId) {
    const config = this.config[connectionId];

    this.connection = new ServiceBusClient(
      [
        `Endpoint=sb://${config.connection.host}`,
        `SharedAccessKeyName=${config.connection.username}`,
        `SharedAccessKey=${config.connection.password}`,
      ].join(';')
    );
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
    }

    this.connection = null;
  }

  async getDLQMessages(connectionId, queue, maxMessageCount, resendMessages = false) {
    await this.connect(connectionId);
    const dlq = this.connection.createReceiver(queue, {
      subQueueType: 'deadLetter',
    });

    let messages;
    if (resendMessages) {
      const sender = this.connection.createSender(queue);

      messages = await dlq.receiveMessages(maxMessageCount);

      await Promise.all(
        messages.map(async (message) => {
          await sender.sendMessages([message]);

          return dlq.completeMessage(message);
        })
      );

      await sender.close();
    } else {
      messages = await dlq.peekMessages(maxMessageCount);
    }

    await dlq.close();

    return messages.map(({ messageId, body, deliveryCount }) => ({
      messageId,
      body,
      deliveryCount,
    }));
  }

  getConnections() {
    return Object.keys(this.config).map((key) => ({
      key,
      queues: this.config[key].queues,
      name: this.config[key].name,
    }));
  }
};
