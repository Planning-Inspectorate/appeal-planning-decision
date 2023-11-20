const { GenericContainer, Wait } = require('testcontainers/');

let mongoDbContainer;

const create = async () => {
	mongoDbContainer = await new GenericContainer('mongo')
		.withName('appeals-api-it-mongodb')
		.withExposedPorts(27017)
		.withWaitStrategy(Wait.forLogMessage('Waiting for connections'))
		.start();

	let dbName = 'appeals-api-integration-test';
	process.env.INTEGRATION_TEST_DB_URL = `mongodb://localhost:${mongoDbContainer.getMappedPort(
		27017
	)}/${dbName}`;
};

const teardown = async () => {
	if (mongoDbContainer) {
		await mongoDbContainer.stop();
	}
};

module.exports = {
	create,
	teardown
};
