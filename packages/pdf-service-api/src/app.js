const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');
const logger = require('./lib/logger');

const {
  server: { showErrors },
} = config;

const app = express();
app
  .use(
    cors({
      origin: '*',
      methods: 'POST',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    })
  )
  .use(bodyParser.json())
  .use('/', routes)
  .use((req, res) => {
    res.status(404).json({
      message: 'Not Found',
      url: req.url,
    });
  })
  .use((err, req, res, next) => {
    logger.error({ err }, 'Uncaught exception');
    res.status(500).json({
      message: err.message,
      stack: showErrors ? err.stack : undefined,
    });
    next();
  });

module.exports = app;
