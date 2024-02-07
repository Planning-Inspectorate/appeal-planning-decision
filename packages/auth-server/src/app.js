import express from 'express';
import pinoExpress from 'express-pino-logger';
import crypto from 'crypto';
import OIDC from 'oidc-provider';

import config from './configuration/config.js';
import logger from './lib/logger.js';
import apiErrorHandler from './errors/api-error-handler.js';

const app = express();

const oidc = new OIDC(`${config.oauth.host}:${config.server.port}`, config.oauth.options);

app
	.use(
		pinoExpress({
			logger,
			genReqId: (req) => req.headers['x-correlation-id'] || crypto.randomUUID()
		})
	)
	.use('/oidc', oidc.callback())
	.get('/test', (req, res) => {
		res.status(200).send('200 - test');
	})
	.get('/favicon.ico', (req, res) => {
		res.sendStatus(204);
	})
	.use(apiErrorHandler);

export default app;
