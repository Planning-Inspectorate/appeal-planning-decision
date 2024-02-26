import { exec } from 'child_process';

import { create } from './external-dependencies/database/test-database.js';

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

	await run(`npx prisma migrate deploy`);
};
