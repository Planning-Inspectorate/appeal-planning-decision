const { PrismaClient } = require('@prisma/client');

/** @typedef {import('@prisma/client').Prisma.PrismaClientOptions} prismaConfig */

/** @type {import('@prisma/client').PrismaClient} */
let prisma;

/**
 * @param {prismaConfig} prismaConfig
 * @returns {import('@prisma/client').PrismaClient}
 */
const createClient = (prismaConfig) => {
	if (prisma) {
		return prisma;
	}

	prisma = new PrismaClient(prismaConfig);
	return prisma;
};

module.exports = createClient;
