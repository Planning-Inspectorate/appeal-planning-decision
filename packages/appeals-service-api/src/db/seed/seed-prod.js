const dbClient = require('../db-client');
const { seedStaticData } = require('./data-static');

async function run() {
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
