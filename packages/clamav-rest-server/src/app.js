const express = require('express');
const bodyParser = require('body-parser');
const pinoExpress = require('express-pino-logger');
const { prometheus } = require('@pins/common');
const uuid = require('uuid');
const multer = require('multer');
const logger = require('./lib/logger');
const proxyController = require('./controllers/proxy-controller');

const upload = multer();

require('express-async-errors');

const app = express();
prometheus.init(app);

app
  .use(
    pinoExpress({
      logger,
      genReqId: (req) => req.headers['x-correlation-id'] || uuid.v4(),
    })
  )
  .use(bodyParser.json())
  .get('/', (req, res) => res.sendStatus(200))
  .post('/', upload.fields([{ name: 'file' }]), proxyController.processFile);

module.exports = app;
