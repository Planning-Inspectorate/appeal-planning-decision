import { GenericContainer, Wait } from 'testcontainers';

/** @type {import('testcontainers').StartedTestContainer[]} */
const containers = [];

async function startSql() {
	const container = await new GenericContainer('mcr.microsoft.com/azure-sql-edge:latest')
		.withName('appeals-auth-mssql-integration-tests')
		.withExposedPorts(1434)
		.withAddedCapabilities('SYS_PTRACE')
		.withUser('root')
		.withEnvironment({
			ACCEPT_EULA: '1',
			MSSQL_SA_PASSWORD: 'DockerDatabaseP@22word!',
			MSSQL_TCP_PORT: '1434'
		})
		.withWaitStrategy(Wait.forListeningPorts())
		.start();

	containers.push(container);

	const sqlDbName = 'pins_front_office_integration_test';
	const connectionString = [
		`sqlserver://localhost:${container.getMappedPort(1434)}`,
		`database=${sqlDbName}`,
		`user=sa`,
		`password=DockerDatabaseP@22word!`,
		`trustServerCertificate=true`
	].join(';');
	process.env.SQL_CONNECTION_STRING_ADMIN = connectionString;
	process.env.SQL_CONNECTION_STRING = connectionString;
}

export const create = async () => {
	await Promise.all([startSql()]);
};

export const teardown = async () => {
	await Promise.all(
		containers.map((c) => {
			console.log(`stopping ${c.getName()}`);
			c.stop();
		})
	);
};
