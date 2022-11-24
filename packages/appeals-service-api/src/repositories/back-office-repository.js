// This class uses rhea since it enables us to use AMQP protocol version 1.0 which Azure Service Bus uses.
// Azure Service Bus doesn't support AMQP protocols less than 1.0, see https://github.com/Azure/azure-service-bus/issues/288
// ¯\_(ツ)_/¯
const container = require('rhea');
const config = require('../configuration/config');
const logger = require('../lib/logger');
class BackOfficeRepository {

	constructor() {}

	/**
	 * 
	 * @param {string} message
	 * @return {Promise<void>}
	 */
	create(message) {

		const options = config.messageQueue.horizonHASPublisher.connection;

		container
			.connect(options)
			.open_sender(config.messageQueue.horizonHASPublisher.queue);

       	container.on('sendable', (context) => {
			context.sender.send({
				body: container.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
				content_type: 'application/json'
			});
			logger.info('Appeal message placed on queue:', message);
       });

       container.on('accepted', (context) => {
			context.connection.close();
			logger.info(`Queue closed on message accepted`);
       });

       container.on('error', (err) => {
			logger.error({ err }, 'There was a problem with the queue');
       });
	}
}

module.exports = { BackOfficeRepository }