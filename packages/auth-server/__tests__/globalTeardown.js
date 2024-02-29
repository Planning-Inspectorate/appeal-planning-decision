import { teardown } from './external-dependencies/database/test-database.js';
import { teardownAPIs } from './external-dependencies/rest-apis/mocked-external-apis.js';

export default async () => {
	await teardown();
	await teardownAPIs();
};
