const { PrismaClient } = require('@prisma/client');

/** @typedef {import('@prisma/client').Prisma.PrismaClientOptions} prismaConfig */

/** @type {import('@prisma/client').PrismaClient} */
let prisma;

/**
 * @param {prismaConfig} prismaConfig
 * @param {import('pino').Logger} [logger]
 * @returns {import('@prisma/client').PrismaClient}
 */
const createClient = (prismaConfig, logger) => {
	if (prisma) {
		return prisma;
	}

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
		/** @param {import('@prisma/client').Prisma.QueryEvent} e */
		const logQuery = (e) => {
			logger.debug('Query: ' + e.query);
			logger.debug('Params: ' + e.params);
			logger.debug('Duration: ' + e.duration + 'ms');
		};

		/** @param {import('@prisma/client').Prisma.LogEvent} e */
		const logError = (e) => logger.error({ e }, 'Prisma error');

		/** @param {import('@prisma/client').Prisma.LogEvent} e */
		const logInfo = (e) => logger.debug({ e });

		/** @param {import('@prisma/client').Prisma.LogEvent} e */
		const logWarn = (e) => logger.warn({ e });

		prisma.$on('query', logQuery);
		prisma.$on('error', logError);
		prisma.$on('info', logInfo);
		prisma.$on('warn', logWarn);
	}

	return prisma;
};

module.exports = createClient;
