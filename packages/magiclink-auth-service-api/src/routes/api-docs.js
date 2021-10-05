const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const fileContents = require('../../lib/getYamlAsJson');

const router = express.Router();

const spec = fileContents(path.join('api', 'openapi.yaml'));

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(spec));

module.exports = router;
