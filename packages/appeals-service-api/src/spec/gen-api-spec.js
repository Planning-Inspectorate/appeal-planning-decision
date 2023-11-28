const swaggerJSDoc = require('swagger-jsdoc');

/**
 * @type {import('swagger-jsdoc').Options}
 */
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Appeals Service API Documentation',
			description: 'An API to service the needs of the Appeals Service',
			version: '1.0.4'
		},
		license: {
			name: 'MIT',
			url: 'https://opensource.org/licenses/MIT'
		},
		servers: [{ url: 'http://localhost:3000/', description: 'local dev' }]
	},
	// files containing annotations and any other yaml files that can be included
	apis: ['./src/routes/*.js', './src/spec/*.yaml']
};

/**
 * Generate the Open API spec from the above options and route definition '@openapi' comments
 *
 * @returns {object}
 */
function generateOpenApiSpec() {
	return swaggerJSDoc(options);
}

module.exports = {
	generateOpenApiSpec
};
