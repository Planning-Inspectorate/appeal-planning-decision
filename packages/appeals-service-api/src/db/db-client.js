const createClient = require('@pins/database/src/create-client.ts').default;
const logger = require('../lib/logger');

/**
 * @returns {import('@prisma/client').PrismaClient}
 */
const createPrismaClient = () => {
	/** @type {import('@pins/database/src/create-client').prismaConfig} */
	const prismaConfig = {
		// need this to load SQL_CONNECTION_STRING value set by test-database.js#create
		// TODO: fix this properly
		datasourceUrl: process.env.SQL_CONNECTION_STRING
	};
	return createClient(prismaConfig, logger);
};

module.exports = { createPrismaClient };
