const amqplib = require('amqplib');

const { RABBITMQ_URL } = process.env;

const publisher = async (queue, message) => {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  const ok = await channel.assertQueue(queue);
  if (ok.queue) {
    const successful = channel.sendToQueue(queue, Buffer.from(message));
    return successful;
  }
  return false;
};

module.exports = {
  publisher,
};
