// prettier-ignore
try { require('node:process').loadEnvFile(); } catch {/* ignore errors*/}

const createPrismaClient = require('../create-client');
const { seedStaticData } = require('./data-static');
const config = require('../configuration/config');

async function run() {
	const dbClient = createPrismaClient(config.db.sql.connectionString);

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
