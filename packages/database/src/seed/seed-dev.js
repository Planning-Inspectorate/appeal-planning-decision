const createPrismaClient = require('../create-client');
const { seedStaticData } = require('./data-static');
const { seedDev } = require('./data-dev');
const config = require('../configuration/config');

async function run() {
	const prismaConfig = {
		datasourceUrl: config.db.sql.connectionString
	};

	const dbClient = createPrismaClient(prismaConfig);

	try {
		await seedStaticData(dbClient);
		await seedDev(dbClient);
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await dbClient.$disconnect();
	}
}

run();
