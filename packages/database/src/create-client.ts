import { PrismaClient, type Prisma } from './client/client.ts';
import { PrismaMssql } from '@prisma/adapter-mssql';

let prisma: PrismaClient;

const createClient = (
	connectionString: string,
	logger?: import('pino').Logger,
	prismaConfigOptions: Omit<Prisma.PrismaClientOptions, 'accelerateUrl'> = {}
): PrismaClient => {
	if (prisma) {
		return prisma;
	}

	if (!connectionString) {
		throw new Error('connectionString not provided to create Prisma Client');
	}

	const client = new PrismaClient({
		adapter: new PrismaMssql(connectionString),
		log: [
			{ emit: 'event', level: 'query' },
			{ emit: 'event', level: 'error' },
			{ emit: 'event', level: 'info' },
			{ emit: 'event', level: 'warn' }
		],
		...prismaConfigOptions
	});

	if (logger) {
		const logQuery = (e: Prisma.QueryEvent) => {
			logger.debug({ query: e.query, params: e.params, duration: e.duration }, 'Prisma query');
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
