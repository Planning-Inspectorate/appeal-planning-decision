/**
 * Horizon Publisher
 *
 * This is a service that listens to a message queue for
 * records to be published to Horizon
 */

const { delay, ServiceBusClient, ServiceBusMessage } = require('@azure/service-bus');
const config = require('./lib/config');
const logger = require('./lib/logger');

async function batchSender() {
  const messages = [
    {
      body: 'Freddie',
      id: Math.random(),
    },
    {
      body: 'Brian',
      id: Math.random(),
    },
    {
      body: 'John',
      id: Math.random(),
    },
    {
      body: 'Roger',
      id: Math.random(),
    },
  ];

  // create a Service Bus client using the connection string to the Service Bus namespace
  const sbClient = new ServiceBusClient(config.queue.connectionString);

  // createSender() can also be used to create a sender for a topic.
  const sender = sbClient.createSender(config.queue.name);

  try {
    // Tries to send all messages in a single batch.
    // Will fail if the messages cannot fit in a batch.
    // await sender.sendMessages(messages);

    // create a batch object
    let batch = await sender.createMessageBatch();
    for (let i = 0; i < messages.length; i++) {
      // for each message in the arry

      // try to add the message to the batch
      if (!batch.tryAddMessage(messages[i])) {
        // if it fails to add the message to the current batch
        // send the current batch as it is full
        await sender.sendMessages(batch);

        // then, create a new batch
        batch = await sender.createBatch();

        // now, add the message failed to be added to the previous batch to this batch
        if (!batch.tryAddMessage(messages[i])) {
          // if it still can't be added to the batch, the message is probably too big to fit in a batch
          throw new Error('Message too big to fit in a batch');
        }
      }
    }

    // Send the last created batch of messages to the queue
    await sender.sendMessages(batch);

    console.log(batch.count);

    console.log(`Sent a batch of messages to the queue: ${config.queue.name}`);

    // Close the sender
    await sender.close();
  } finally {
    await sbClient.close();
  }
}

batchSender().catch((err) => {
  logger.fatal({ err }, 'Error starting service - killing service');
  process.exit(1);
});
