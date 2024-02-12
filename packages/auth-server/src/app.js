import express from 'express';
import pinoExpress from 'express-pino-logger';
import crypto from 'crypto';
import OIDC from 'oidc-provider';

import config from './configuration/config.js';
import logger from './lib/logger.js';
import apiErrorHandler from './errors/api-error-handler.js';
import * as ropc from './lib/ropc-grant-handler.js';
const app = express();

const oidc = new OIDC(`${config.oidc.host}:${config.server.port}`, config.oidc.configuration);
oidc.registerGrantType(ropc.gty, ropc.handler, ropc.parameters, []);

/** @type {import('express').Handler} */
const noContentHandler = (req, res) => {
	res.sendStatus(204);
};

app
	.use(
		pinoExpress({
			logger,
			genReqId: (req) => req.headers['x-correlation-id'] || crypto.randomUUID()
		})
	)
	.get('/', noContentHandler)
	.get('/favicon.ico', noContentHandler)
	.use('/oidc', oidc.callback()) // /oidc/.well-known/openid-configuration
	.use(apiErrorHandler);

export default app;
