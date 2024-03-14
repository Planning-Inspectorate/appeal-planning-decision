import express from 'express';
import pinoExpress from 'express-pino-logger';
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

const app = express();

const oidc = new OIDC(`${oidcConfig.host}:${config.server.port}`, oidcConfig.configuration);
oidc.registerGrantType(consts.AUTH.GRANT_TYPE.OTP, otp.handler, otp.parameters, []);
oidc.registerGrantType(consts.AUTH.GRANT_TYPE.ROPC, ropc.handler, ropc.parameters, []);
subscribe(oidc);

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
	.use(consts.AUTH.OIDC_ENDPOINT, oidc.callback()) // /oidc/.well-known/openid-configuration
	.use(apiErrorHandler);

export default app;
