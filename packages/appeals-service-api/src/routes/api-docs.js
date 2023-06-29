const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// const fs = require('fs');
// const path = require('path');
// const yaml = require('js-yaml');
// const logger = require('../lib/logger');
// const config = require('../configuration/config');

const router = express.Router();

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Appeals Service API Documentation',
			description:
				'API to <ul><li>create, retrieve and modify planning appeals and </li><li>retrieve local planning authorities.</li></ul>',
			version: '1.0.4'
		},
		license: {
			name: 'MIT',
			url: 'https://opensource.org/licenses/MIT'
		},
		servers: {
			urls: ['http://localhost:3000/']
		}
	},
	apis: ['./src/routes/appeals.js'] // files containing annotations as above
};

const openapiSpecification = swaggerJSDoc(options);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// let spec;

// try {
// 	const fileContents = fs.readFileSync(path.join(config.docs.api.path, 'openapi.yaml'), 'utf8');
// 	spec = yaml.safeLoad(fileContents);
// 	logger.debug(`Loaded api spec doc`);
// } catch (err) {
// 	logger.error(`problem loading api spec doc\n${err}`);
// }

// router.use('/', swaggerUi.serve);
// router.get('/', swaggerUi.setup(spec));

module.exports = router;
