import { TestMessageQueueConfiguration } from './test-message-queue-configuration';

export class TestMessageQueue {
	private amqpTestConfiguration: TestMessageQueueConfiguration;

	constructor(config: TestMessageQueueConfiguration) {
		this.amqpTestConfiguration = config;
	}

	async sendMessageToQueue(msg: string) {
		this.amqpTestConfiguration.getQueue().publish(msg);
	}

	async getMessageFromQueue(): Promise<string | null| undefined> {
		let message: string | null| undefined;
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