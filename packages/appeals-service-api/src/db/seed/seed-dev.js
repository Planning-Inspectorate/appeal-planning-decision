const dbClient = require('../db-client');
const { seedStaticData } = require('./data-static');
const { seedDev } = require('./data-dev');

async function run() {
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