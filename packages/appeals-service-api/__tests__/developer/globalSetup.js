const { exec } = require('child_process');
const path = require('path');
const { createPrismaClient } = require('../../src/db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');

function run(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (err, stdout) => {
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

	const schemaPath = path.resolve(__dirname, '../../../database/src/schema.prisma');
	await run(`npx prisma generate --schema ${schemaPath}`);
	await run(`npx prisma migrate deploy --schema ${schemaPath}`);

	const sqlClient = createPrismaClient(process.env.SQL_CONNECTION_STRING);
	await seedStaticData(sqlClient);
	await sqlClient.$disconnect();
};
