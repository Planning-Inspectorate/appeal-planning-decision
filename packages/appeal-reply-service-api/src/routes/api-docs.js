const express = require('express');
const swaggerUi = require('swagger-ui-express');

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const logger = require('../lib/logger');
const config = require('../lib/config');

const router = express.Router();

let spec;

try {
  const fileContents = fs.readFileSync(path.join(config.docs.api.url, 'openapi.yaml'), 'utf8');
  spec = yaml.safeLoad(fileContents);
  logger.debug(`Loaded api spec doc`);
} catch (err) {
  logger.error(`problem loading api spec doc\n${err}`);
}

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(spec));

module.exports = router;
