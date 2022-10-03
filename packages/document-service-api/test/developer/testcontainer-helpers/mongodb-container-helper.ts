import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers';

let startedContainer: StartedTestContainer;

const createMongoContainer = async () => {
	startedContainer = await new GenericContainer('mongo')
		.withName('documents-api-it-mongodb')
		.withExposedPorts(27017)
		.withWaitStrategy(Wait.forLogMessage('Waiting for connections'))
		.start();

	process.env.MONGODB_DB_NAME = 'documents-api-integration-test';
	process.env.MONGODB_URL = `mongodb://localhost:${startedContainer.getMappedPort(27017)}/${
		process.env.MONGODB_DB_NAME
	}`;
};

const destroyMongoContainer = async () => {
	if (startedContainer) {
		await startedContainer.stop();
	}
};

module.exports = {
	createMongoContainer,
	destroyMongoContainer
};
