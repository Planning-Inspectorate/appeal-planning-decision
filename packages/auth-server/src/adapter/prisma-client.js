import createClient from '@pins/database/src/create-client.js';
import config from '../configuration/config.js';
import logger from '../lib/logger.js';

/** @type {import('@pins/database/src/create-client').prismaConfig} */
const prismaConfig = {
	datasourceUrl: config.db.sql.connectionString
};

/**
 * @returns {import('@prisma/client').PrismaClient}
 */
const createPrismaClient = () => {
	return createClient(prismaConfig, logger);
};

export default createPrismaClient;
