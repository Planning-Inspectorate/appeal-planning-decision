const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const config = require('../lib/config');
const getYamlAsJson = require('../lib/getYamlAsJson');
const isFeatureActive = require('../../config/featureFlag')

const {
	docs: {
		api: { path: apiDocsPath }
	}
} = config;

const router = express.Router();
const file = getYamlAsJson(path.join(apiDocsPath, 'openapi.yaml'));

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(file));
router.get('/featureFlag', async (_, res) =>
{ 
	if (await isFeatureActive('test-flag')) { 
        res.send('Flag on')
    } else { 
        res.send('Flag off ')
    }
});

module.exports = router;
