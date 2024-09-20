const { exec } = require('child_process');

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
	process.env.LOGGER_LEVEL = 'debug';
	await create();

	await run(`npx prisma migrate deploy`);
};
