/**
 * Horizon Publisher
 *
 * This is a service that listens to a message queue for
 * records to be published to Horizon
 */

const { ServiceBusClient } = require('@azure/service-bus');
const config = require('./lib/config');
const logger = require('./lib/logger');

let sbClient;
let receiver;

async function main() {
  logger.info({ config }, 'Starting Horizon Publisher service');

  sbClient = new ServiceBusClient(config.queue.connectionString);
  receiver = sbClient.createReceiver(config.queue.name);

  receiver.subscribe({
    processError(err) {
      logger.error({ err }, 'Message receive error');
    },
    async processMessage(message) {
      console.log('process');
      // try {
      logger.info({ message: message.body }, 'Message received');

      // await new Promise((resolve) => setTimeout(resolve, 5000));
      logger.info('Message receive finished');
      // } catch (err) {
      //   console.log('abandon');
      //   await receiver.abandonMessage(message);
      //
      //   throw err;
      // }
    },
  });
}

main().catch((err) => {
  logger.fatal({ err }, 'Error starting service - killing service');
  process.exit(1);
});

process.on('SIGINT', async () => {
  logger.debug('System closing');
  try {
    if (receiver) {
      logger.debug('Closing receiver');
      await receiver.close();
      logger.debug('Receiver closer');
    } else {
      logger.debug('Receiver not connected');
    }
  } catch (err) {
    logger.warn({ err }, 'Unable to close receiver');
  }

  try {
    if (sbClient) {
      logger.debug('Closing service bus client');
      await sbClient.close();
      logger.debug('Service bus closer');
    } else {
      logger.debug('Service bus not connected');
    }
  } catch (err) {
    logger.warn({ err }, 'Unable to close service bus client');
  }
});
