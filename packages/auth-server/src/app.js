import express from 'express';
import pinoHttp from 'pino-http';
import crypto from 'crypto';

import consts from '@pins/common/src/constants.js';
import NotifyBuilder from '@pins/common/src/lib/notify/notify-builder.js';
import Notify from './lib/notify.js';

import getApiErrorHandler from './errors/api-error-handler.js';

import createPrismaClient from './adapter/prisma-client.js';
import TokenRepository from './grants/token-repo.js';
import AccountRepository from './account/repository.js';

import setupOidc from './oidc/setup.js';

import https from 'https';
import http from 'http';

/** @type {import('express').Handler} */
const noContentHandler = (req, res) => {
	res.sendStatus(204);
};

/**
 * @typedef {Object} dependencies
 * @property {import('@prisma/client').PrismaClient} primsaClient
 * @property {import('./grants/token-repo.js').default} tokenRepo
 * @property {import('./account/repository.js').default} accountRepo
 * @property {import('./lib/notify.js').default} notify
 * @property {import('pino').Logger} logger
 */

/**
 * @param {{config: import('./configuration/config.js').default, logger: import('pino').Logger}} deps
 * @returns {import('express').Application}
 */
export function getApp({ config, logger }) {
	https.globalAgent = new https.Agent({ keepAlive: false });
	http.globalAgent = new http.Agent({ keepAlive: false });

	const app = express();
	const primsaClient = createPrismaClient({ config, logger });

	const dependencies = {
		primsaClient,
		tokenRepo: new TokenRepository({ client: primsaClient }),
		accountRepo: new AccountRepository({ client: primsaClient, logger }),
		notify: new Notify({ notifyBuilder: NotifyBuilder, logger }),
		logger
	};

	const oidc = setupOidc(dependencies);

	app
		.use(
			pinoHttp({
				logger,
				genReqId: (req) => req.headers['x-correlation-id'] || crypto.randomUUID(),
				autoLogging: {
					ignore: (req) => {
						if (req.headers['user-agent'] === 'AlwaysOn') return true;

						return false;
					}
				},
				serializers: {
					req: (req) => ({
						id: req.id,
						method: req.method,
						url: req.url,
						query: req.query,
						params: req.params
					}),
					res: (res) => ({
						statusCode: res.statusCode
					})
				}
			})
		)
		.get('/', noContentHandler)
		.get('/health', (_req, res) => {
			res.status(200).send({
				status: 'OK',
				uptime: process.uptime(),
				commit: config.gitSha
			});
		})
		.get('/favicon.ico', noContentHandler)
		.use(consts.AUTH.OIDC_ENDPOINT, oidc.callback()) // /oidc/.well-known/openid-configuration
		.use(getApiErrorHandler(logger));

	return app;
}
