const express = require('express');
const swaggerUi = require('swagger-ui-express');

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const logger = require('../util/logger');

const router = express.Router();

let spec;

try {
  const fileContents = fs.readFileSync(path.join('api', 'openapi.yaml'), 'utf8');
  spec = yaml.safeLoad(fileContents);
  logger.debug(`Loaded magic link api spec doc`);
} catch (err) {
  logger.error(`problem loading magic link api spec doc\n${err}`);
}

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(spec));

module.exports = router;
