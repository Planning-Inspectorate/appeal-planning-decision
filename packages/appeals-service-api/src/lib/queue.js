/**
 * This is a repository implementation which uses rhea (https://www.npmjs.com/package/rhea),
 * a reactive library for the AMQP protocol for easy development of both clients and servers,
 * to commit appeals to a permenant data store.
 */
const container = require('rhea');
const defaultConfig = require('./config');
const logger = require('./logger');

function addAppeal(appeal, configuration) {
	let config = configuration;
	if (!config) {
		config = defaultConfig.messageQueue.horizonHASPublisher;
	}

	console.log(config);
	let connectionQueue;
	try {
		connectionQueue = container.connect(config.connection).open_sender(config.queue);
		logger.info(connectionQueue);
	} catch (err) {
		logger.error({ err }, 'Cannot connect to the queue');
	}

	container.once('sendable', (context) => {
		context.sender.send({
			body: container.message.data_section(Buffer.from(JSON.stringify(appeal), 'utf-8')),
			content_type: 'application/json'
		});
		logger.info({ message: appeal }, 'Appeal message placed on queue');
	});

	container.on('accepted', (context) => {
		context.connection.close();
		logger.info(`Queue closed on message accepted`);
	});

	container.on('error', (err) => {
		logger.error({ err }, 'There was a problem with the queue');
	});
}

module.exports = {
	addAppeal
};
