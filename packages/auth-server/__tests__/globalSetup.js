import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { create } from './external-dependencies/database/test-database.js';
import { MockedExternalApis } from './external-dependencies/rest-apis/mocked-external-apis.js';

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

export default async () => {
	await create();
	await MockedExternalApis.setup();

	const databasePath = path.resolve(__dirname, '../../database');
	await run(`npm run generate`, databasePath);
	await run(`npx prisma migrate deploy`, databasePath);
};
