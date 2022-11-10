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
