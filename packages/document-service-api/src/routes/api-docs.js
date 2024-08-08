const express = require('express');
const swaggerUi = require('swagger-ui-express');

const logger = require('../lib/logger');
const { generateOpenApiSpec } = require('../spec/gen-api-spec');

const router = express.Router();

let spec;

try {
	logger.debug(`generating api spec`);
	spec = generateOpenApiSpec();
	logger.debug(`generated api spec`);
} catch (err) {
	logger.error(`problem generating api spec doc\n${err}`);
}

const options = {
	swaggerOptions: {
		url: '/api-docs/swagger.json'
	},
	explorer: true
};

router.use('/swagger.json', (req, res) => res.json(spec));
router.use('/', swaggerUi.serveFiles(null, options), swaggerUi.setup(spec, options));

module.exports = router;
