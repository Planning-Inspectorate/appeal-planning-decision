const { promises: fs } = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const config = require('../lib/config');

const router = express.Router();

async function loadSpec(logger) {
  try {
    const filePath = path.join(config.docs.api.path, 'openapi.yaml');
    logger.debug({ filePath }, 'Reading OpenAPI spec file');
    const yamlSpec = await fs.readFile(filePath, 'utf8');

    return yaml.safeLoad(yamlSpec);
  } catch (err) {
    logger.error({ err }, 'Failed to load OpenAPI spec');

    throw new Error('Failed to load OpenAPI spec');
  }
}

router.use('/', swaggerUi.serve);
router.get('/', async (req, res, next) => {
  swaggerUi.setup(await loadSpec(req.log))(req, res, next);
});
router.get('/swagger.json', async (req, res) => {
  res.send(await loadSpec(req.log));
});

module.exports = router;
