const http = require('http');
const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const pinoExpress = require('express-pino-logger');
const { DateTime } = require('luxon');
const uuid = require('uuid');
require('express-async-errors');

const logger = require('./logger');
const config = require('./lib/config');
const routes = require('./routes');

const app = express();

app
  .set('view engine', 'pug')
  .set('views', path.join(__dirname, 'views'))
  .use(
    pinoExpress({
      logger,
      genReqId: (req) => req.headers['x-correlation-id'] || uuid.v4(),
    })
  )
  .use(bodyParser.json())
  .use((req, res, next) => {
    const dt = new DateTime(new Date());
    res.locals.loadTime = dt.toLocaleString(DateTime.DATETIME_FULL);
    next();
  })
  .use('/', routes)
  .use((req, res) => {
    /* Handle 404 error */
    res.status(404).render('error/pageMissing', {
      title: http.STATUS_CODES[404],
      url: req.url,
    });
  })
  .use((err, req, res, next) => {
    /* Unhandled error - four arguments are required */
    req.log.error({ err }, 'Uncaught exception');

    res.status(500).render('error/uncaughtException', {
      title: err.message,
      stack: config.server.showErrors ? err.stack : undefined,
    });

    next();
  });

app.listen(config.server.port, () => {
  logger.info({ config }, 'Listening');
});
