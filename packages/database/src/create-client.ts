import { PrismaClient, type Prisma } from '@prisma/client';

let prisma: PrismaClient;

const createClient = (
	prismaConfig: Prisma.PrismaClientOptions,
	logger: import('pino').Logger
): PrismaClient => {
	if (prisma) {
		return prisma;
	}

	console.log('initialising Prisma', prismaConfig);

	const client = new PrismaClient({
		...prismaConfig,
		log: [
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
		]
	});

	if (logger) {
		const logQuery = (e: Prisma.QueryEvent) => {
			logger.debug('Query: ' + e.query);
			logger.debug('Params: ' + e.params);
			logger.debug('Duration: ' + e.duration + 'ms');
		};

		const logError = (e: Prisma.LogEvent) => logger.error({ e }, 'Prisma error');
		const logInfo = (e: Prisma.LogEvent) => logger.debug({ e });
		const logWarn = (e: Prisma.LogEvent) => logger.warn({ e });

		client.$on('query', logQuery);
		client.$on('error', logError);
		client.$on('info', logInfo);
		client.$on('warn', logWarn);
	}

	prisma = client;

	return prisma;
};

export default createClient;
