const Ajv = require('ajv').default;
const addFormats = require('ajv-formats').default;
const loadAllSchemas = () =>
	import('pins-data-model').then(({ loadAllSchemas }) => loadAllSchemas());
const util = require('util');

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
class SchemaValidator {
	/** @type {Ajv | null} */
	ajv = null;

	constructor() {
		this.setSchemas = this.setSchemas.bind(this);
		this.getValidator = this.getValidator.bind(this);
		this.validate = this.validate.bind(this);

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
		const flatSchemas = Object.values(schemas).reduce((a, c) => ({ ...a, ...c }), {});
		this.ajv = new Ajv({ schemas: flatSchemas, allErrors: true });
		addFormats(this.ajv);
	}

	/**
	 * use this to validate a given payload matches a selected schema
	 * @template Payload
	 * @param {string} schemaName
	 * @param {unknown} payload
	 * @returns {payload is Payload}
	 */
	validate(schemaName, payload) {
		// this'll throw if the promise in preloadSchemas hasn't resolved yet
		if (!this.ajv) throw new Error('Validate called before schemas had finished initialising');
		const validationResult = this.ajv.validate(`${schemaName}.schema.json`, payload);
		if (this.ajv.errors) {
			console.error(
				'Validation errors: ',
				util.inspect(this.ajv.errors, { showHidden: true, depth: Infinity, colors: true })
			);
			console.log(
				'Submitted payload: ',
				util.inspect(payload, { showHidden: true, depth: Infinity, colors: true })
			);
		}
		return validationResult;
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

exports.SchemaValidator = SchemaValidator;
