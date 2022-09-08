import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';
import { connect, Connection, Channel, ConsumeMessage } from 'amqplib';

let startedContainer: StartedTestContainer;
let channel: Channel;
let messages: string[] = [];
let amqpConnection: Connection;

const sendMessageToQueue = (msg) => {
	console.log('sending message');
	channel.sendToQueue('test', Buffer.from(msg));
	console.log('sent messages');
};

const expectMessages =
	(expectedMessages: string[]) =>
	(msg: ConsumeMessage | null): void => {
		if (msg) {
			messages.push(msg.content.toString());
			channel.ack(msg);
		}

		if (messages.length == expectedMessages.length) {
			expectedMessages.forEach((expectedMessage) => messages.includes(expectedMessage));
			console.log('Closing connection');
			amqpConnection.close();
		}
	};

const startContainer = async () => {
	startedContainer = await new GenericContainer('rabbitmq:3.10-management')
		.withStartupTimeout(120000)
		.withExposedPorts(5672, 15672)
		.withWaitStrategy(Wait.forLogMessage('Server startup complete'))
		.start();

	await startedContainer.exec(['rabbitmq-plugins', 'enable', 'rabbitmq_amqp1_0']);

	let url = 'amqp://guest:guest@localhost:' + startedContainer.getMappedPort(5672);
	amqpConnection = await connect(url);
	channel = await amqpConnection.createChannel();
	await channel.assertQueue('test');
};

const stopContainer = async () => {
	startedContainer.stop();
};

module.exports = {
	expectMessages,
	startContainer,
	stopContainer,
	sendMessageToQueue
};
