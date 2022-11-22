import { GenericContainer, Wait, StartedTestContainer } from 'testcontainers/';

let startedContainer: StartedTestContainer;

const create = async () => {
	startedContainer = await new GenericContainer('mongo')
		.withName('appeals-api-it-mongodb')
		.withExposedPorts(27017)
		.withWaitStrategy(Wait.forLogMessage('Waiting for connections'))
		.start();

	let dbName = 'appeals-api-integration-test';
	process.env.INTEGRATION_TEST_DB_URL = `mongodb://localhost:${startedContainer.getMappedPort(
		27017
	)}/${dbName}`;
};

const teardown = async () => {
	if (startedContainer) {
		await startedContainer.stop();
	}
};

module.exports = {
	create,
	teardown
};