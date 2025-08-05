const { GenericContainer, Wait } = require('testcontainers/');

/**
 * @type {import('testcontainers').StartedTestContainer[]}
 */
const containers = [];

const create = async () => {
	await Promise.all([startMongo(), startSql()]);
};

async function startMongo() {
	const container = await new GenericContainer('mongo')
		.withName('appeals-api-it-mongodb')
		.withExposedPorts(27017)
		.withWaitStrategy(Wait.forLogMessage('Waiting for connections'))
		.start();
	containers.push(container);

	const dbName = 'appeals-api-integration-test';
	process.env.INTEGRATION_TEST_DB_URL = `mongodb://localhost:${container.getMappedPort(
		27017
	)}/${dbName}`;
}

async function startSql() {
	const container = await new GenericContainer('mcr.microsoft.com/azure-sql-edge:latest')
		.withName('appeals-mssql-integration-tests')
		.withExposedPorts(1433)
		.withAddedCapabilities('SYS_PTRACE')
		.withUser('root')
		.withEnvironment({ ACCEPT_EULA: '1', MSSQL_SA_PASSWORD: 'DockerDatabaseP@22word!' })
		.withWaitStrategy(Wait.forLogMessage('now ready for client connections'))
		.start();

	containers.push(container);

	const sqlDbName = 'pins_front_office_integration_test';
	const connectionString = [
		`sqlserver://localhost:${container.getMappedPort(1433)}`,
		`database=${sqlDbName}`,
		`user=sa`,
		`password=DockerDatabaseP@22word!`,
		`trustServerCertificate=true`
	].join(';');
	process.env.SQL_CONNECTION_STRING_ADMIN = connectionString;
	process.env.SQL_CONNECTION_STRING = connectionString;
}

const teardown = async () => {
	await Promise.all(containers.map((c) => c.stop()));
};

module.exports = {
	create,
	teardown
};
