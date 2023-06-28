const swaggerAutogen = require('swagger-autogen');

const document = {
	info: {
		// by default: '1.0.0'
		version: '1.0.0',
		// by default: 'REST API'
		title: 'PINS Appeals Service API',
		// by default: ''
		description: 'PINS Appeals Service API documentation from Swagger'
	},
	// by default: 'localhost:3000'
	host: '',
	// by default: '/'
	basePath: '/',
	// by default: ['http']
	schemes: [],
	// by default: ['application/json']
	consumes: [],
	// by default: ['application/json']
	produces: [],
	// by default: empty Array
	tags: [
		{
			// Tag name
			name: '',
			// Tag description
			description: ''
		}
		// { ... }
	],
	// by default: empty object (Swagger 2.0)
	securityDefinitions: {},
	definitions: {},
	'@definitions': {
		InternalError: {
			type: 'object',
			properties: {
				errors: {
					type: 'object',
					properties: {
						unknown: {
							type: 'string',
							example: 'unknown internal error'
						}
					}
				}
			}
		}
	},
	components: {}
};

const outputFile = './api/openapi.json';
const endpointsFiles = ['./routes/*.js'];

swaggerAutogen()(outputFile, endpointsFiles, document);
