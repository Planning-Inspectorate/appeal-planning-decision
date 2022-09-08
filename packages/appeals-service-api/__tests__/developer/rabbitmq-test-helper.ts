/**
 * Functions are ordered top to bottom in the way you should interact with them, i.e:
 */
import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';
import { connect, Connection, Channel, ConsumeMessage } from 'amqplib';

let startedContainer: StartedTestContainer;
let channel: Channel;
let amqpConnection: Connection;
let messages: string[] = [];

const startContainer = async () => {
	startedContainer = await new GenericContainer('rabbitmq:3.10-management')
		.withStartupTimeout(120000)
		.withExposedPorts(5672, 15672)
		.withWaitStrategy(Wait.forLogMessage('Server startup complete'))
		.start();

	await startedContainer.exec(['rabbitmq-plugins', 'enable', 'rabbitmq_amqp1_0']);
	amqpConnection = await connect(
		'amqp://guest:guest@localhost:' + startedContainer.getMappedPort(5672)
	);
	channel = await amqpConnection.createChannel();
	await channel.assertQueue('test');
};

const sendMessage = (msg) => {
	channel.sendToQueue('test', Buffer.from(msg));
};

const getMessages =
	(numberOfExpectedMessages: Number) =>
	async (msg: ConsumeMessage | null): Promise<string[]> => {
		if (msg) {
			messages.push(msg.content.toString());
			channel.ack(msg);
		}

		if (messages.length == numberOfExpectedMessages) {
			return messages;
		}
	};

const stopContainer = async () => {
	await channel.close();
	await amqpConnection.close();
	await startedContainer.stop();
};

module.exports = {
	startContainer,
	sendMessage,
	getMessages,
	stopContainer
};
