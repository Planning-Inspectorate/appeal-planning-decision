import { AMQPClient, AMQPQueue } from '@cloudamqp/amqp-client';
const config = require('../configuration/config');
const logger = require('../lib/logger');

export class BackOfficeRepository {
	private queue: AMQPQueue;

	constructor() {}

	async create(message: string): Promise<void> {
		await this.setupQueue();
		await this.queue.publish(JSON.stringify(message));
	}

	/**
	 * We could implement this via a static `create` method which returns a `BackOfficeRepository` object but
	 * in some cases e.g. testing, the URL parts may not be known until after the static initialiser lifecycle
	 * is called.
	 */
	private async setupQueue(): Promise<void> {
		if (this.queue === undefined) {
			const queueConnectionConfig = config.messageQueue.horizonHASPublisher.connection;
			const url = `amqp://${queueConnectionConfig.username}:${queueConnectionConfig.password}@${queueConnectionConfig.host}:${queueConnectionConfig.port}`;
			logger.debug('AMQP URL', url);
			const connection = await new AMQPClient(url).connect();
			const channel = await connection.channel();
			this.queue = await channel.queue(config.messageQueue.horizonHASPublisher.queue);
		}
	}
}