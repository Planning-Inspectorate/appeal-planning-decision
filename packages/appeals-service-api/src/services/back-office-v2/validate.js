const Ajv = require('ajv').default;
const { loadAllSchemas } = require('pins-data-model');

/**
 * @typedef {import('pins-data-model').LoadedSchemas} LoadedSchemas
 */

/**
 * @template Payload
 * @typedef {{(schema: string, payload: unknown): payload is Payload}} ValidateFromGivenSchema
 */

/**
 * @template Payload
 * @typedef {{(payload: unknown): payload is Payload}} Validate
 */

/**
 * @template Payload
 * @type {(commandsAndEvents: LoadedSchemas) => ValidateFromGivenSchema<Payload>}
 */

// This class is used to obfuscate the async nature of loadAllSchemas
// Clear it out once the schemas can be loaded synchronously
export class SchemaValidator {
	/** @type {Record<string, import('ajv').AnySchema> | null} */
	schemas = null;

	constructor() {
		this.preloadSchemas();
	}

	/**
	 * plops the schemas into this.schemas
	 * This just avoids async gunge
	 * @returns {Promise<void>}
	 */
	preloadSchemas() {
		return new Promise((resolve, reject) => {
			loadAllSchemas().then(this.setSchemas, reject);
			resolve();
		});
	}

	/**
	 * this just makes preloadSchemas look pretty
	 * @param {LoadedSchemas} schemas
	 * @returns {void}
	 */
	setSchemas(schemas) {
		// _flattens_ the object
		this.schemas = Object.values(schemas).reduce((a, c) => ({ ...a, ...c }), {});
	}

	/**
	 * use this to validate a given payload matches a selected schema
	 * @template Payload
	 * @param {string} schemaName
	 * @param {unknown} payload
	 * @returns {payload is Payload}
	 */
	validate(schemaName, payload) {
		const ajv = new Ajv();
		// this'll throw if the promise in preloadSchemas hasn't resolved yet
		if (!this.schemas) throw new Error('Validate called before schemas had finished initialising');
		return !!ajv.validate(`${this.schemas[schemaName]}.schema.json`, payload);
	}

	/**
	 * use this to get a validator, useful for passing in a generic
	 * @template Payload
	 * @param {string} schemaName
	 * @returns {Validate<Payload>}
	 */
	getValidator(schemaName) {
		/** @type {Validate<Payload>} */
		return (payload) => this.validate(schemaName, payload);
	}
}
