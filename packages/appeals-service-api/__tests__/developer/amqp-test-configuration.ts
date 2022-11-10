import { AMQPClient, AMQPChannel, AMQPQueue } from '@cloudamqp/amqp-client';
import { StartedTestContainer } from 'testcontainers/';

export class AMQPTestConfiguration {
	private startedContainer: StartedTestContainer;
	private amqpConnection: AMQPClient;
	private channel: AMQPChannel;
	private queue: AMQPQueue;

	constructor(
		startedContainer: StartedTestContainer,
		amqpConnection: AMQPClient,
		channel: AMQPChannel,
		queue: AMQPQueue
	) {
		this.startedContainer = startedContainer;
		this.amqpConnection = amqpConnection;
		this.channel = channel;
		this.queue = queue;
	}

	getQueue(): AMQPQueue {
		return this.queue;
	}

	async teardown() {
		try {
			await this.channel.close();
			await this.amqpConnection.close();
			await this.startedContainer.stop();
		} catch (e) {
			console.log(e);
		}
	}
}
