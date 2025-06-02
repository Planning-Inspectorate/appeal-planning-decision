import express from 'express';
import pinoHttp from 'pino-http';
import crypto from 'crypto';

import consts from '@pins/common/src/constants.js';
import { getLifetimeDependencies, attachPerRequestDependencies } from './dependencies.js';

import getApiErrorHandler from './errors/api-error-handler.js';

import setupOidc from './oidc/setup.js';

import https from 'https';
import http from 'http';

/** @type {import('express').Handler} */
const noContentHandler = (_, res) => {
	res.sendStatus(204);
};

/**
 * @param {{config: import('./configuration/config.js').default, logger: import('pino').Logger}} deps
 * @returns {import('express').Application}
 */
export function getApp({ config, logger }) {
	https.globalAgent = new https.Agent({ keepAlive: false });
	http.globalAgent = new http.Agent({ keepAlive: false });

	const app = express();

	const lifetimeDependencies = getLifetimeDependencies({ config, logger });

	const oidc = setupOidc(lifetimeDependencies);

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
		.use(attachPerRequestDependencies({ config, logger, lifetimeDependencies }))
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
