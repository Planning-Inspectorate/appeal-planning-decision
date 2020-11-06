/**
 * server
 */

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const pinoExpress = require('express-pino-logger');
const uuid = require('uuid');
require('express-async-errors');

const config = require('./lib/config');
const healthChecks = require('./lib/healthchecks');
const logger = require('./lib/logger');
const routes = require('./routes');

module.exports = () => {
  const app = express();

  const server = http.createServer(app);

  healthChecks(server);

  app
    .use(
      pinoExpress({
        logger,
        genReqId: () => uuid.v4(),
      })
    )
    .use(bodyParser.json())
    .use('/', routes)
    .use((req, res) => {
      /* Handle 404 error */
      res.status(404).json({
        message: http.STATUS_CODES[404],
        url: req.url,
      });
    })
    .use((err, req, res, next) => {
      /* Unhandled error - four arguments are required */
      req.log.error({ err }, 'Uncaught exception');

      res.status(500).json({
        message: err.message,
        stack: config.server.showErrors ? err.stack : undefined,
      });

      next();
    });

  server.listen(config.server.port, () => {
    logger.info({ config }, 'Listening');
  });
};
