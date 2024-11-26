import express from 'express';
import pinoHttp from 'pino-http';
import crypto from 'crypto';
import OIDC from 'oidc-provider';

import config from './configuration/config.js';
import oidcConfig from './oidc/index.js';
import consts from '@pins/common/src/constants.js';

import logger from './lib/logger.js';
import { subscribe } from './lib/oidc-logging.js';

import * as otp from './grants/otp-grant-handler.js';
import * as ropc from './grants/ropc-grant-handler.js';
import apiErrorHandler from './errors/api-error-handler.js';

import https from 'https';
import http from 'http';
https.globalAgent = new https.Agent({ keepAlive: false });
http.globalAgent = new http.Agent({ keepAlive: false });

const app = express();

const oidc = new OIDC(`${oidcConfig.host}:${config.server.port}`, oidcConfig.configuration);
oidc.proxy = config.server.proxy;
oidc.registerGrantType(consts.AUTH.GRANT_TYPE.OTP, otp.handler, otp.parameters, []);
oidc.registerGrantType(consts.AUTH.GRANT_TYPE.ROPC, ropc.handler, ropc.parameters, []);
subscribe(oidc);

/** @type {import('express').Handler} */
const noContentHandler = (req, res) => {
	res.sendStatus(204);
};

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
	.get('/health', (req, res) => {
		res.status(200).send({
			status: 'OK',
			uptime: process.uptime(),
			commit: config.gitSha
		});
	})
	.get('/favicon.ico', noContentHandler)
	.use(consts.AUTH.OIDC_ENDPOINT, oidc.callback()) // /oidc/.well-known/openid-configuration
	.use(apiErrorHandler);

export default app;
