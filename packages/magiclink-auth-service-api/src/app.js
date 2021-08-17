const express = require('express');
const pinoExpress = require('express-pino-logger');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const logger = require('./util/logger');
const routes = require('./routes');
const apiErrorHandler = require('./error/apiErrorHandler');

const app = express();

app
  .use(
    pinoExpress({
      logger,
      genReqId: (req) => req.headers['x-correlation-id'] || uuid.v4(),
    }),
  )
  .use(bodyParser.json())
  .use('/', routes)
  .use(apiErrorHandler);

module.exports = app;
