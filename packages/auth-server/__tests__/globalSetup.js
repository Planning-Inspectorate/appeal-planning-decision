import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { create } from './external-dependencies/database/test-database.js';
import { MockedExternalApis } from './external-dependencies/rest-apis/mocked-external-apis.js';

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

export default async () => {
	await create();
	await MockedExternalApis.setup();

	const schemaPath = path.resolve(__dirname, '../../database/src/schema.prisma');
	await run(`npx prisma migrate deploy --schema ${schemaPath}`);
};
