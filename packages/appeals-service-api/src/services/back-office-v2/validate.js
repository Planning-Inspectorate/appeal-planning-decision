import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { loadAllSchemas } from 'pins-data-model';
import NodeCache from 'node-cache';

const nodeCache = new NodeCache();

const setCache = (/** @type {NodeCache.Key} */ key, /** @type {Record<string,any>[]} */ value) => {
	nodeCache.set(key, value, 3600);
};

const getCache = (/** @type {NodeCache.Key} */ key) => {
	return nodeCache.get(key);
};

/**
 * @template Payload
 * @typedef {{(schema: string, payload: unknown): payload is Payload}} ValidateFromSchema
 */

/**
 * @template Payload
 * @type {(commandsAndEvents: import('pins-data-model').LoadedSchemas) => ValidateFromSchema<Payload>}
 */
const validateFromSchemaFactory = (commandsAndEvents) => {
	/** @type {(schema: string, payload: unknown) => payload is Payload} */
	return (schema, payload) => {
		const cacheKey = 'integration-schemas';
		let schemas = getCache(cacheKey);
		if (!schemas) {
			schemas = {
				...commandsAndEvents.schemas,
				...commandsAndEvents.commands
			};

			setCache(cacheKey, schemas);
		}

		const ajv = new Ajv({ schemas });
		addFormats(ajv);

		const validator = ajv.getSchema(`${schema}.schema.json`);
		if (!validator) {
			throw new Error(`'${schema}' schema could not be loaded`);
		}
		if (!validator(payload)) {
			return false;
		} else {
			return true;
		}
	};
};

/**
 * @template Payload
 * @returns {Promise<ValidateFromSchema<Payload>>}
 */
export const buildValidateFromSchema = async () => {
	const schemas = await loadAllSchemas();
	// @ts-ignore
	return validateFromSchemaFactory(schemas);
};

async () => {
	const thing = {};

	/** @type {ValidateFromSchema<{ thing: string }>} */
	const validate = await buildValidateFromSchema();
	if (validate('service-user', thing)) {
		thing;
	}
};
