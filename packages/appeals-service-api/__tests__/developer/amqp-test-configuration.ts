import { AMQPClient, AMQPChannel, AMQPQueue } from '@cloudamqp/amqp-client';
import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';

export class AMQPTestConfiguration {
	private startedContainer: StartedTestContainer;
	private amqpConnection: AMQPClient;
	private channel: AMQPChannel;
	private queue: AMQPQueue;
	private port: Number;

	static async create(queueName: string) {
		// We used the rabbitmq image rather than rabbitmq:management image since we don't
		// need any management of queues via a browser as part of tests.
		let container = await new GenericContainer('rabbitmq')
			.withExposedPorts(5672)
			.withWaitStrategy(Wait.forLogMessage('Server startup complete'))
			.start();

		// We need to enable this since the permanent application repository uses "rhea"
		// to interact with queues, and "rhea" uses version 1.0 of AMQP. RabbitMQ,
		// out-of-the-box, uses 0.9.1. So, we need to enable this plugin to allow the Appeals
		// API to communicate with RabbitMQ during tests.
		container.exec(['rabbitmq-plugins', 'enable', 'rabbitmq_amqp1_0']);

		let port = container.getMappedPort(5672);

		// We need to get the exact port number since Testcontainers assigns a random port
		// (by design) on the host machine to map to the one you expose in the container
		// itself. See here for more https://www.testcontainers.org/features/networking/
		let connection = await new AMQPClient(`amqp://guest:guest@localhost:${port}`).connect();
		let channel = await connection.channel();
		let queue = await channel.queue(queueName);

		return new AMQPTestConfiguration(container, connection as AMQPClient, channel, queue, port);
	}

	constructor(
		startedContainer: StartedTestContainer,
		amqpConnection: AMQPClient,
		channel: AMQPChannel,
		queue: AMQPQueue,
		port: Number
	) {
		this.startedContainer = startedContainer;
		this.amqpConnection = amqpConnection;
		this.channel = channel;
		this.queue = queue;
		this.port = port;
	}

	getQueue(): AMQPQueue {
		return this.queue;
	}

	getPort(): Number {
		return this.port;
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
