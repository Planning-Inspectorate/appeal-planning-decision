const express = require('express');
const { pinoHttp } = require('pino-http');
const compression = require('compression');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const logger = require('./lib/logger');
const routes = require('./routes');
const apiErrorHandler = require('./errors/apiErrorHandler');
const { openApiValidationErrorHandler } = require('./validators/validate-open-api');
require('express-async-errors');
require('./controllers/appeals-for-submission-to-horizon-scheduler')();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app
	.use(
		pinoHttp({
			logger,
			genReqId: (req) => req.headers['x-correlation-id'] || uuid.v4()
		})
	)
	.use(bodyParser.json())
	.use(compression()) /* gzip compression */
	.use('/', routes)
	.use(openApiValidationErrorHandler)
	.use(apiErrorHandler);

module.exports = app;
