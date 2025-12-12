const { loadAllSchemasSync } = require('@planning-inspectorate/data-model');
const { SchemaValidator } = require('./validate');

jest.mock('@planning-inspectorate/data-model');
jest.mock('#lib/logger.js');

describe('SchemaValidator', () => {
	/** @type {import('./validate').SchemaValidator} */
	let schemaValidator;
	let mockSchemas = {
		schema1: {
			'schema1.schema.json': {
				type: 'object',
				properties: { key: { type: 'string' } },
				required: ['key']
			}
		},
		schema2: { 'schema2.schema.json': { type: 'object' } }
	};

	beforeEach(() => {
		loadAllSchemasSync.mockReturnValue(mockSchemas);
		schemaValidator = new SchemaValidator();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should preload schemas on instantiation', () => {
		expect(loadAllSchemasSync).toHaveBeenCalled();
		expect(schemaValidator.ajv).not.toBeNull();
	});

	it('should set schemas correctly', () => {
		const flatSchemas = {
			'schema1.schema.json': mockSchemas.schema1['schema1.schema.json'],
			'schema2.schema.json': mockSchemas.schema2['schema2.schema.json']
		};
		expect(schemaValidator.ajv.opts.schemas).toEqual(flatSchemas);
	});

	it('should validate payload correctly', () => {
		const payload = { key: 'value' };
		const schemaName = 'schema1';

		const result = schemaValidator.validate(schemaName, payload);
		expect(result).toBe(true);

		const validator = schemaValidator.getValidator(schemaName);
		const result2 = validator(payload);
		expect(result2).toEqual(result);
	});

	it('should throw error if validate is called before schemas are set', () => {
		schemaValidator.ajv = null;
		expect(() => schemaValidator.validate('schema1', {})).toThrow(
			'Validate called before schemas had finished initialising'
		);
	});
});
