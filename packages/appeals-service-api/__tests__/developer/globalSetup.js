const { exec } = require('child_process');
const path = require('path');

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
	process.env.LOGGER_LEVEL = 'info';
	await create();

	const schemaPath = path.resolve(__dirname, '../../../database/src/schema.prisma');
	await run(`npx prisma migrate deploy --schema ${schemaPath}`);
};
