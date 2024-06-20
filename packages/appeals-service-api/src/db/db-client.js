const createClient = require('@pins/database/src/create-client');
const config = require('../configuration/config');
const logger = require('../lib/logger');

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

module.exports = { createPrismaClient };
