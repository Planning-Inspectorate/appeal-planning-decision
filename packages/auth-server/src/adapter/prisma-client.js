import createClient from '@pins/database/src/create-client.js';

/** @type {import('@pins/database/src/create-client').prismaConfig} */
const prismaConfig = {
	datasourceUrl: process.env.SQL_CONNECTION_STRING
};

/**
 * @returns {import('@prisma/client').PrismaClient}
 */
const createPrismaClient = () => {
	return createClient(prismaConfig);
};

export default createPrismaClient;
