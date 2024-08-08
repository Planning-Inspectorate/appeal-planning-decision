const swaggerJSDoc = require('swagger-jsdoc');

/**
 * @type {import('swagger-jsdoc').Options}
 */
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Appeals Document Service API',
			description: 'An API to proxy documents and control access',
			version: '1.0.0',
			license: {
				name: 'MIT',
				url: 'https://opensource.org/licenses/MIT'
			}
		},
		servers: [{ url: 'http://localhost:3001/', description: 'local dev' }]
	},
	// files containing annotations and any other yaml files that can be included
	apis: ['./src/routes/*.js', './src/routes/*.yaml', './src/routes/**/*.yaml', './src/spec/*.yaml']
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
