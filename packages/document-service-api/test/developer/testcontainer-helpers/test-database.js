const { GenericContainer, Wait } = require('testcontainers/');

/**
 * @type {import('testcontainers').StartedTestContainer[]}
 */
const containers = [];

const create = async () => {
	await Promise.all([startSql()]);
};

async function startSql() {
	const container = await new GenericContainer('mcr.microsoft.com/azure-sql-edge:latest')
		.withName('docs-mssql-integration-tests')
		.withExposedPorts(1435)
		.withAddedCapabilities('SYS_PTRACE')
		.withUser('root')
		.withEnvironment({
			ACCEPT_EULA: '1',
			MSSQL_SA_PASSWORD: 'DockerDatabaseP@22word!',
			MSSQL_TCP_PORT: '1435'
		})
		.withWaitStrategy(Wait.forListeningPorts())
		.start();

	containers.push(container);

	const sqlDbName = 'pins_front_office_integration_test';
	const connectionString = [
		`sqlserver://localhost:${container.getMappedPort(1435)}`,
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
