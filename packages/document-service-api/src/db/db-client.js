const createClient = require('@pins/database/src/create-client');
const config = require('../configuration/config');
const logger = require('../lib/logger');

/**
 * @param {string} [connectionString]
 * @returns {import('@pins/database/src/client').PrismaClient}
 */
const createPrismaClient = (connectionString) => {
	const prismaConnectionString = connectionString ?? config.db.sql.connectionString;
	return createClient(prismaConnectionString, logger);
};

module.exports = { createPrismaClient };
