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
	const { create } = require('./testcontainer-helpers/test-database');
	const { createAzuriteContainer } = require('./testcontainer-helpers/azurite-container-helper');
	await create();
	await createAzuriteContainer();

	process.env.FILE_MAX_SIZE_IN_BYTES = '4000'; // Just big enough for the ./test-files/sample.pdf
	process.env.FILE_UPLOAD_PATH = __dirname;

	await run(`npx prisma migrate deploy`); //--schema "./packages/database/src/schema.prisma"`
};
