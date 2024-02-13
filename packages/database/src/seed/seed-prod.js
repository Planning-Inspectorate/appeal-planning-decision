const createPrismaClient = require('../create-client');
const { seedStaticData } = require('./data-static');
const config = require('../configuration/config');

async function run() {
	const prismaConfig = {
		datasourceUrl: config.db.sql.connectionString
	};

	const dbClient = createPrismaClient(prismaConfig);

	try {
		await seedStaticData(dbClient);
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await dbClient.$disconnect();
	}
}

run();
