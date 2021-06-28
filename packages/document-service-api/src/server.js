/**
 * server
 */

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { BasicStrategy } = require('passport-http');
const passport = require('passport');
const pinoExpress = require('express-pino-logger');
const { prometheus } = require('@pins/common');
const uuid = require('uuid');
require('express-async-errors');

const config = require('./lib/config');
const healthChecks = require('./lib/healthchecks');
const fwaSessionStrategy = require('./security/strategy/fwa-session');
const logger = require('./lib/logger');
const routes = require('./routes');

passport.use('fwa-session', fwaSessionStrategy);

passport.use(
  'something-else',
  new BasicStrategy((username, password, done) => {
    if (username !== 'another-valid') {
      return done(null, false);
    }

    return done(null, { hello: 'chris' });
  })
);

module.exports = () => {
  const app = express();

  prometheus.init(app);

  const server = http.createServer(app);

  healthChecks(server);

  app
    .use(
      pinoExpress({
        logger,
        genReqId: (req) => req.headers['x-correlation-id'] || uuid.v4(),
      })
    )
    .use(bodyParser.json())
    .use(passport.initialize())
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
