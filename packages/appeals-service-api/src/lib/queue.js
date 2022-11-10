const { AMQPClient } = require('@cloudamqp/amqp-client');
const config = require('../configuration/config');

async function publishMessage(message) {
	const queueConfig = config.messageQueue.horizonHASPublisher;
	const url = `amqp://${queueConfig.connection.username}:${queueConfig.connection.password}@${queueConfig.connection.host}:${queueConfig.connection.port}`;
	let connection = await new AMQPClient(url).connect();
	let channel = await connection.channel();
	let queue = await channel.queue(queueConfig.queue);
	await queue.publish(JSON.stringify(message));
}

module.exports = {
	publishMessage
};
