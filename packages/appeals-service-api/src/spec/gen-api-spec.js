const swaggerJSDoc = require('swagger-jsdoc');
const { generateApi } = require('swagger-typescript-api');
const path = require('path');
const prettier = require('prettier');
const fs = require('fs/promises');

const typesFile = path.join(__dirname, 'api-types.d.ts');

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
		servers: [{ url: 'http://localhost:3000/', description: 'local dev' }],
		tags: [
			{
				name: 'appeal-cases'
			},
			{
				name: 'token'
			},
			{
				name: 'users'
			},
			{
				name: 'v1'
			}
		]
	},
	// files containing annotations and any other yaml files that can be included
	apis: ['./src/routes/**/*.js', './src/routes/**/*.yaml', './src/spec/*.yaml']
};

/**
 * Generate the Open API spec from the above options and route definition '@openapi' comments
 *
 * @returns {*}
 */
function generateOpenApiSpec() {
	return swaggerJSDoc(options);
}

async function generateApiSpecTypes() {
	const spec = generateOpenApiSpec();

	const { files } = await generateApi({
		name: path.basename(typesFile),
		spec,
		output: false,
		generateClient: false
	});

	for (const f of files) {
		const filePath = path.join(__dirname, f.fileName + f.fileExtension);
		await formatWrite(filePath, f.fileContent);
	}
}

/**
 * Format contents with prettier and write to file
 *
 * @param {string} filePath
 * @param {string} content
 */
async function formatWrite(filePath, content) {
	const options = await prettier.resolveConfig(filePath);
	if (options === null) {
		throw new Error(`no prettier config for ${filePath}`);
	}
	options.filepath = filePath;
	const formatted = prettier.format(content, options);
	await fs.writeFile(filePath, formatted);
}

module.exports = {
	generateOpenApiSpec,
	generateApiSpecTypes
};
