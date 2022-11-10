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
import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';
import { AMQPClient, AMQPChannel, AMQPQueue } from '@cloudamqp/amqp-client';

export class AMQPContainer {
	startedContainer: StartedTestContainer;
	amqpConnection: AMQPClient;
	channel: AMQPChannel;
	queue: AMQPQueue;

	static async create(queueName: string) {
		// We used the rabbitmq image rather than rabbitmq:management image since we don't
		// need any management of queues via a browser as part of tests.
		let container = await new GenericContainer('rabbitmq')
			.withExposedPorts(5672, 15672)
			.withWaitStrategy(Wait.forLogMessage('Server startup complete'))
			.start();

		// We need to enable this since the permanent application repository uses "rhea"
		// to interact with queues, and "rhea" uses version 1.0 of AMQP. RabbitMQ,
		// out-of-the-box, uses 0.9.1. So, we need to enable this plugin to allow the Appeals
		// API to communicate with RabbitMQ during tests.
		container.exec(['rabbitmq-plugins', 'enable', 'rabbitmq_amqp1_0']);

		let port = container.getMappedPort(5672);
		process.env.HORIZON_HAS_PUBLISHER_PORT = port.toString();
		process.env.HORIZON_HAS_PUBLISHER_QUEUE = 'test';
		console.log(container.getMappedPort(15672));

		// We need to get the exact port number since Testcontainers assigns a random port
		// (by design) on the host machine to map to the one you expose in the container
		// itself. See here for more https://www.testcontainers.org/features/networking/
		let connection = await new AMQPClient(`amqp://guest:guest@localhost:${port}`).connect();
		let channel = await connection.channel();
		let queue = await channel.queue(queueName);

		return {
			container: container,
			connection: connection,
			channel: channel,
			queue: queue
		};
	}

	constructor(config: {
		container: StartedTestContainer;
		connection: AMQPClient;
		channel: AMQPChannel;
		queue: AMQPQueue;
	}) {
		this.startedContainer = config.container;
		this.amqpConnection = config.connection;
		this.channel = config.channel;
		this.queue = config.queue;
	}

	async sendMessageToQueue(msg: string) {
		console.log(`Sending message "${msg}" to queue "${this.queue}"`);
		this.queue.publish(msg);
	}

	async getMessageFromQueue(): Promise<string> {
		let message;
		await this.queue.get().then((msg) => (message = msg?.bodyToString()));
		return message;
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
