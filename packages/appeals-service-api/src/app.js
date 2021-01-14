const express = require('express');
const pinoExpress = require('express-pino-logger');
const compression = require('compression');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const { prometheus } = require('@pins/common');
const logger = require('./lib/logger');
const routes = require('./routes');
const apiErrorHandler = require('./error/apiErrorHandler');
require('express-async-errors');

const app = express();

prometheus.init(app);

app.use(bodyParser.json());

app
  .use(
    pinoExpress({
      logger,
      genReqId: (req) => req.headers['x-correlation-id'] || uuid.v4(),
    })
  )
  .use(bodyParser.json())
  .use(compression()) /* gzip compression */
  .use('/', routes)
  .use(apiErrorHandler);

module.exports = app;
