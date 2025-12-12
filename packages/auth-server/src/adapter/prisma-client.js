import createClient from '@pins/database/src/create-client.ts';
import config from '../configuration/config.js';
import logger from '../lib/logger.js';

/**
 * @param {string} [connectionString]
 * @returns {import('@pins/database/src/client/client.ts').PrismaClient}
 */
const createPrismaClient = (connectionString) => {
	const prismaConnectionString = connectionString ?? config.db.sql.connectionString;
	return createClient(prismaConnectionString, logger);
};

export default createPrismaClient;
