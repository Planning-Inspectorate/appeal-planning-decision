const path = require('path');
const { formatWrite } = require('./format-write');
const { generateOpenApiSpec } = require('./gen-api-spec');

async function run() {
	const spec = generateOpenApiSpec();
	await formatWrite(path.join(__dirname, './spec.json'), JSON.stringify(spec));
}

run().catch(console.error);
