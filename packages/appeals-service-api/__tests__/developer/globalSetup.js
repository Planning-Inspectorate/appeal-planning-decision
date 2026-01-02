const { exec } = require('child_process');
const path = require('path');

/**
 * @param {string} cmd
 * @param {string} workingDirectory
 * @returns {Promise<string>}
 */
function run(cmd, workingDirectory) {
	return new Promise((resolve, reject) => {
		exec(cmd, { cwd: workingDirectory }, (err, stdout) => {
			if (err) {
				reject(err);
			} else {
				resolve(stdout);
			}
		});
	});
}

module.exports = async () => {
	const { create } = require('./external-dependencies/database/test-database');
	process.env.LOGGER_LEVEL = 'error';
	await create();

	const databasePath = path.resolve(__dirname, '../../../database');
	await run(`npm run generate`, databasePath);
	await run(`npx prisma migrate deploy`, databasePath);

	const { createPrismaClient } = require('../../src/db/db-client');
	const { seedStaticData } = require('@pins/database/src/seed/data-static');

	const sqlClient = createPrismaClient(process.env.SQL_CONNECTION_STRING);
	await seedStaticData(sqlClient);
	await sqlClient.$disconnect();
};
