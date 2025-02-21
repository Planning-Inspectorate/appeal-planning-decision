import createClient from '@pins/database/src/create-client.js';

/**
 * @param {{config: import('../configuration/config.js').default, logger: import('pino').Logger}} deps
 * @returns {import('@prisma/client').PrismaClient}
 */
const createPrismaClient = ({ config, logger }) => {
	return createClient(
		{
			datasourceUrl: config.db.sql.connectionString
		},
		logger
	);
};

export default createPrismaClient;
