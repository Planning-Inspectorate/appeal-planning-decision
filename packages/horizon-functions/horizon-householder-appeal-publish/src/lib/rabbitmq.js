const amqplib = require('amqplib')
const config = require('../config')

const publisher = async (queue, message) => {
  const connection = await amqplib.connect(config.amqp.url)
  const channel = await connection.createChannel()
  const ok = await channel.assertQueue(queue)
  if (ok.queue) {
    const successful = channel.sendToQueue(queue, Buffer.from(message))
    return successful
  }
  return false
}

module.exports = { publisher }
