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
import { connect, Connection, Channel } from 'amqplib';
import { env } from 'node:process';

let startedContainer: StartedTestContainer;
let channel: Channel;
let amqpConnection: Connection;
let port: Number;

const createAMQPTestQueue = async () => {
	// We used the rabbitmq image rather than rabbit-mq-management image since we don't
	// need any management of queues via a browser as part of tests.
	startedContainer = await new GenericContainer('rabbitmq')
		.withExposedPorts(5672)
		.withWaitStrategy(Wait.forLogMessage('Server startup complete'))
		.start();

	// We need to enable this since the permanent application repository uses "rhea"
	// to interact with queues, and "rhea" uses version 1.0 of AMQP. RabbitMQ,
	// out-of-the-box, uses 0.9.1. So, we need to enable this plugin to allow the Appeals
	// API to communicate with RabbitMQ during tests.
	await startedContainer.exec(['rabbitmq-plugins', 'enable', 'rabbitmq_amqp1_0']);

	port = startedContainer.getMappedPort(5672);
	env['HORIZON_HAS_PUBLISHER_PORT'] = port.toString();

	// We need to get the exact port number since Testcontainers assigns a random port
	// (by design) on the host machine to map to the one you expose in the container
	// itself. See here for more https://www.testcontainers.org/features/networking/
	amqpConnection = await connect(`amqp://guest:guest@localhost:${port}`);

	channel = await amqpConnection.createChannel();
	await channel.assertQueue('test');
};

const sendMessageToAMQPTestQueue = (msg) => {
	channel.sendToQueue('test', Buffer.from(msg));
};

const getMessageFromAMQPTestQueue = async () => {
	let message;

	// This will implicitly remove the message from the queue :)
	await channel.get('test').then((msg) => {
		message = msg;
	});
	return message.content.toString();
};

const destroyAMQPTestQueue = async () => {
	// await channel.close();
	await amqpConnection.close();
	await startedContainer.stop();
};

module.exports = {
	createAMQPTestQueue,
	sendMessageToAMQPTestQueue,
	getMessageFromAMQPTestQueue,
	destroyAMQPTestQueue
};
