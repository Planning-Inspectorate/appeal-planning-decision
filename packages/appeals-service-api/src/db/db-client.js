const createClient = require('@pins/database/src/create-client');
const config = require('../configuration/config');

/** @type {import('@pins/database/src/create-client').prismaConfig} */
const prismaConfig = {
	datasourceUrl: config.db.sql.connectionString
};

// log sql queries generated by prisma
if (config.logger.level === 'debug') {
	prismaConfig.log = ['query'];
}

/**
 * @returns {import('@prisma/client').PrismaClient}
 */
const createPrismaClient = () => {
	return createClient(prismaConfig);
};

module.exports = { createPrismaClient };
