import NotifyBuilder from '@pins/common/src/lib/notify/notify-builder.js';
import NotifyService from '@pins/common/src/lib/notify/notify-service.js';
import Notify from './lib/notify.js';

import createPrismaClient from './adapter/prisma-client.js';
import TokenRepository from './grants/token-repo.js';
import AccountRepository from './account/repository.js';

import Account from './account/account.js';

/**
 * Initial deps required in main
 * @typedef {Object} rootDependencies
 * @property {import('pino').Logger} logger
 * @property {import('./configuration/config.js').default} config
 */

/**
 * Created once per lifetime of app
 * @typedef {Object} lifetimeDependencies
 * @property {import('@prisma/client').PrismaClient} primsaClient
 * @property {import('./grants/token-repo.js').default} tokenRepo
 * @property {import('./account/repository.js').default} accountRepo
 * @property {import('pino').Logger} logger
 */

/**
 * Created on every request
 * @typedef {Object} requestDependencies
 * @property {import('./lib/notify.js').default} notify
 */

/**
 * Created on every request
 * @typedef {requestDependencies & lifetimeDependencies} allDependencies
 */

/**
 * @param {rootDependencies} dependencies
 * @returns {Notify}
 */
const getNotify = ({ config, logger }) => {
	const notifyClient = NotifyBuilder.getNotifyClient(
		config.services.notify.baseUrl,
		config.services.notify.serviceId,
		config.services.notify.apiKey
	);
	const notifyService = new NotifyService({ logger, notifyClient });
	const notify = new Notify({
		notifyBuilder: NotifyBuilder, // legacy
		notifyService, // modern client
		v2registrationConfirmation: NotifyService.templates.appealSubmission.v2registrationConfirmation,
		logger
	});
	return notify;
};

/**
 * function that generates app lifetime dependencies
 * @param {rootDependencies} dependencies
 * @returns {lifetimeDependencies}
 */
export const getLifetimeDependencies = ({ config, logger }) => {
	const primsaClient = createPrismaClient({ config, logger });

	return {
		logger,
		primsaClient,
		tokenRepo: new TokenRepository({ client: primsaClient }),
		accountRepo: new AccountRepository({ client: primsaClient, logger })
	};
};

const ignorePaths = ['/.well-known', '/health'];

/**
 * Middleware that attaches all dependencies to the request object.
 * @param {rootDependencies & {lifetimeDependencies: lifetimeDependencies} } param0
 * @returns {import('express').Handler}
 */
export const attachPerRequestDependencies =
	({ config, logger, lifetimeDependencies }) =>
	(req, _, next) => {
		logger.warn('#########');
		logger.warn('here');
		if (ignorePaths.some((path) => req.url.startsWith(path))) {
			return next();
		}

		const allDependencies = {
			...lifetimeDependencies,
			notify: getNotify({ config, logger })
		};

		if (!req.dependencies) {
			req.dependencies = {};
		}

		// is there a better way to achieve this
		// oidc calls Account internally
		// any benefit to splitting lifetime/request on Account?
		Account.setDependencies(allDependencies);
		req.dependencies = allDependencies;

		next();
	};
