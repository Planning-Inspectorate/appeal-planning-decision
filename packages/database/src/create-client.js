const { PrismaClient } = require('./client');
const { PrismaMssql } = require('@prisma/adapter-mssql');

/**
 * @typedef {import('@pins/database/src/client').Prisma.PrismaClientOptions} prismaConfig
 **/

/** @type {PrismaClient} */
let prisma;

/**
 * @param {string} connectionString
 * @param {import('pino').Logger} [logger]
 * @param {prismaConfig} [prismaConfigOptions]
 * @returns {PrismaClient}
 */
const createClient = (connectionString, logger, prismaConfigOptions) => {
	if (prisma) {
		return prisma;
	}

	if (!connectionString) {
		throw new Error('connectionString not provided to create Prisma Client');
	}

	/** @type {prismaConfig} */
	const prismaConfig = prismaConfigOptions || {};
	prismaConfig.adapter = new PrismaMssql(connectionString);
	prismaConfig.log = [
		{
			emit: 'event',
			level: 'query'
		},
		{
			emit: 'event',
			level: 'error'
		},
		{
			emit: 'event',
			level: 'info'
		},
		{
			emit: 'event',
			level: 'warn'
		}
	];

	prisma = new PrismaClient(prismaConfig);

	if (logger) {
		/** @param {import('@pins/database/src/client').Prisma.QueryEvent} e */
		const logQuery = (e) => {
			logger.debug({ query: e.query, params: e.params, duration: e.duration }, 'Prisma query');
		};

		/** @param {import('@pins/database/src/client').Prisma.LogEvent} e */
		const logError = (e) => logger.error({ e }, 'Prisma error');

		/** @param {import('@pins/database/src/client').Prisma.LogEvent} e */
		const logInfo = (e) => logger.debug({ e });

		/** @param {import('@pins/database/src/client').Prisma.LogEvent} e */
		const logWarn = (e) => logger.warn({ e });

		// @ts-ignore
		prisma.$on('query', logQuery);
		// @ts-ignore
		prisma.$on('error', logError);
		// @ts-ignore
		prisma.$on('info', logInfo);
		// @ts-ignore
		prisma.$on('warn', logWarn);
	}

	return prisma;
};

module.exports = createClient;
