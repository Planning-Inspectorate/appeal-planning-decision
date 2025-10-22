const path = require('path');
const { formatWrite } = require('./format-write');
const { generateOpenApiSpec } = require('./gen-api-spec');

const typesFile = path.join(__dirname, 'api-types.d.ts');

/**
 * Generate the Open API spec from the above options and route definition '@openapi' comments
 *
 * @returns {Promise<*>}
 */
exports.generateApiSpecTypes = async () => {
	const spec = generateOpenApiSpec();
	const { generateApi } = await import('swagger-typescript-api');

	const { files } = await generateApi({
		fileName: path.basename(typesFile),
		spec,
		output: false,
		generateClient: false
	});

	for (const f of files) {
		const filePath = path.join(__dirname, f.fileName + f.fileExtension);
		await formatWrite(filePath, f.fileContent);
	}
};
