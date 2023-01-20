const express = require('express');
const pinoExpress = require('express-pino-logger');
const compression = require('compression');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const { prometheus } = require('@pins/common');
const logger = require('./lib/logger');
const routes = require('./routes');
const apiErrorHandler = require('./errors/apiErrorHandler');
require('express-async-errors');
// require('./scheduledTasks/failed-horizon-upload-tasks')();

const app = express();

prometheus.init(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app
	.use(
		pinoExpress({
			logger,
			genReqId: (req) => req.headers['x-correlation-id'] || uuid.v4()
		})
	)
	.use(bodyParser.json())
	.use(compression()) /* gzip compression */
	.use('/', routes)
	.use(apiErrorHandler);

module.exports = app;
