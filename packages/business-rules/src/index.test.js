const index = require('./index');
const rules = require('./rules');
const validation = require('./validation');
const schemas = require('./schemas');
const constants = require('./constants');
const config = require('./config');
const mappings = require('./mappings');

describe('index', () => {
	it('should export the expected data shape', () => {
		expect(index).toEqual({
			rules,
			validation,
			schemas,
			constants,
			config,
			mappings
		});
	});
});
