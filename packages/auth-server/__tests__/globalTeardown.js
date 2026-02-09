import { teardown } from './external-dependencies/database/test-database.js';

export default async () => {
	await teardown();
};
