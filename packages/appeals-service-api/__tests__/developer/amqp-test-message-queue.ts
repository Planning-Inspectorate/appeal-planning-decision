/**
 * This is intended to be able to spin-up a separate AMQP system for testing to give us
 * a high degree of confidence that the Appeals API's behaviour works as intended with
 * an external AMQP system.
 *
 * The external system is implemented using RabbitMQ since RabbitMQ is a solid,
 * well-maintained, familiar implementation of AMQP for engineers.
 *
 * Functions are ordered top to bottom in the way you should interact with them.
 */

import { AMQPClient } from '@cloudamqp/amqp-client';
import { AMQPTestConfiguration } from './amqp-test-configuration';
export class AMQPTestMessageQueue {
	private amqpTestConfiguration: AMQPTestConfiguration;

	constructor(config: AMQPTestConfiguration) {
		this.amqpTestConfiguration = config;
	}

	async sendMessageToQueue(msg: string) {
		this.amqpTestConfiguration.getQueue().publish(msg);
	}

	async getMessageFromQueue(): Promise<string> {
		let message;
		await this.amqpTestConfiguration
			.getQueue()
			.get()
			.then((msg) => (message = msg?.bodyToString()));
		return message;
	}

	async teardown() {
		await this.amqpTestConfiguration.teardown();
	}
}
