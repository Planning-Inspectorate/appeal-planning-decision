////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
///// WARNING: THIS CLASS IS DEPRECATED UNTIL WE BETTER UNDERSTAND ///// 
/////          AMQP 1.0, AZURE SERVICE BUS, AND AZURE FUNCTIONS.   /////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// This class uses rhea since it enables us to use AMQP protocol version 1.0 which Azure Service Bus uses.
// Azure Service Bus doesn't support AMQP protocols less than 1.0, see https://github.com/Azure/azure-service-bus/issues/288
// ¯\_(ツ)_/¯
const container = require('rhea');
const config = require('../configuration/config');
const logger = require('../lib/logger');
class BackOfficeRepository {

	#sender = null

	constructor() {}

	/**
	 * 
	 * @param {string} message
	 * @return {Promise<void>}
	 */
	create(message) {
		logger.debug(`Attempting to send the following message to the back-office ${message}`)

		// We don't do this set up in the constructor because, if we do, the message queue to connect
		// to may not be available, and the app blows up due to timeout exceptions thrown by rhea.
		// Note that we only want one sender, hence this block of code!
		if (this.#sender == null) {
			this.#sender = container
				.connect(config.messageQueue.horizonHASPublisher.connection)
				.open_sender(config.messageQueue.horizonHASPublisher.queue);
		}

		this.#sender.send({
			body: container.message.data_section(Buffer.from(JSON.stringify(message), 'utf-8')),
			content_type: 'application/json'
		});
		logger.debug(`Message sent to the queue`);

		container.on('error', (err) => {
			logger.error({ err }, 'There was a problem with the queue');
       	});

		container.on('disconnected', (context) => {
			context.connection.close();
		})
	}
}

module.exports = { BackOfficeRepository }