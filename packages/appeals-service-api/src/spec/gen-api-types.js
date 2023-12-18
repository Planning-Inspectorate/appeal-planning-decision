const { generateApiSpecTypes } = require('./gen-api-spec');

/**
 * Generate type definitions from the API spec and write to api-types.d.ts
 */
async function run() {
	await generateApiSpecTypes();
}

run().catch(console.error);
