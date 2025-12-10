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
	const { create } = require('./testcontainer-helpers/test-database');
	const { createAzuriteContainer } = require('./testcontainer-helpers/azurite-container-helper');
	await create();
	await createAzuriteContainer();

	process.env.FILE_MAX_SIZE_IN_BYTES = '4000'; // Just big enough for the ./test-files/sample.pdf
	process.env.FILE_UPLOAD_PATH = __dirname;
	process.env.LOGGER_LEVEL = 'error';

	const databasePath = path.resolve(__dirname, '../../../database');
	await run(`npm run generate`, databasePath);
	await run(`npx prisma migrate deploy`, databasePath);
};
