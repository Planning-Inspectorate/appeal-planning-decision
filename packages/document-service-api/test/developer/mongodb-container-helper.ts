import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';

let startedContainer: StartedTestContainer;

const createMongoContainer = async () => {
	startedContainer = await new GenericContainer('mongo')
		.withName('documents-api-it-mongodb')
		.withExposedPorts(27017)
		.withWaitStrategy(Wait.forLogMessage('Waiting for connections'))
		.start();

	let dbName = 'documents-api-integration-test';
	process.env.INTEGRATION_TEST_DB_URL = `mongodb://localhost:${startedContainer.getMappedPort(
		27017
	)}/${dbName}`;
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
