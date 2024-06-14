const config = require('./configuration/config');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { pinoHttp } = require('pino-http');
const uuid = require('uuid');
const logger = require('./lib/logger');
const routes = require('./routes');
require('express-async-errors');
const app = express();

app
	.use(bodyParser.json())
	.use(
		pinoHttp({
			logger,
			genReqId: (req) => req.headers['x-correlation-id'] || uuid.v4()
		})
	)
	.use('/', routes)
	.use((req, res) => {
		/* Handle 404 error */
		res.status(404).json({
			message: http.STATUS_CODES[404],
			url: req.url
		});
	})
	.use((err, req, res, next) => {
		/* Unhandled error - four arguments are required */
		req.log.error({ err }, 'Uncaught exception');

		res.status(500).json({
			message: err.message,
			stack: config.server.showErrors ? err.stack : undefined
		});

		next();
	});

module.exports = app;
