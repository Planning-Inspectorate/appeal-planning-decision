import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';
import { AMQPContainer } from './amqp-container';

module.exports = async () => {
	const { createMongoContainer } = require('./mongodb-container-helper');

	await createMongoContainer();
};
