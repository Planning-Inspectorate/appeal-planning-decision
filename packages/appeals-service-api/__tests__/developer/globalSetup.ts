module.exports = async () => {
	const {
		createMongoContainer,
		destroyMongoContainer,
		containerNotSpunUp
	} = require('./mongodb-container-helper');
	const {
		createAMQPTestQueue,
		getMessageFromAMQPTestQueue,
		destroyAMQPTestQueue
	} = require('./amqp-container-helper');

	await createMongoContainer();
	await createAMQPTestQueue();
};
