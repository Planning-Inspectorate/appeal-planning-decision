const { AMQPClient } = require('@cloudamqp/amqp-client');
const config = require('../configuration/config');
const logger = require('../lib/logger');

class BackOfficeRepository {
	#queue;

	constructor() {
		this.#queue = null;
	}

	/**
	 * 
	 * @param {string} message
	 * @return {Promise<void>}
	 */
	async create(message) {
		await this.#setupQueue();
		if (this.#queue !== null) {
			await this.#queue.publish(JSON.stringify(message));
		}
	}

	/**
	 * 
	 * @return {Promise<void>}
	 */
	async #setupQueue() {
		//  We could implement this via a static `create` method which returns a `BackOfficeRepository` object but
		//  in some cases e.g. testing, the URL parts may not be known until after the static initialiser lifecycle
		//  is called.
		if (this.#queue == null) {
			const queueConnectionConfig = config.messageQueue.horizonHASPublisher.connection;
			const url = `amqp://${queueConnectionConfig.username}:${queueConnectionConfig.password}@${queueConnectionConfig.host}:${queueConnectionConfig.port}`;
			logger.debug('AMQP URL', url);
			const connection = await new AMQPClient(url).connect();
			const channel = await connection.channel();
			this.#queue = await channel.queue(config.messageQueue.horizonHASPublisher.queue);
		}
	}
}

module.exports = { BackOfficeRepository }