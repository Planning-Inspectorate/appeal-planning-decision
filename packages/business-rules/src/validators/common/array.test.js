const { maybeOption } = require('./array');

describe('maybeOption', () => {
	let schema;
	const fieldName = 'testField';
	const validOptions = ['a', 'b', 'c'];

	beforeEach(() => {
		schema = {
			test: jest.fn(function (name, message, fn) {
				this._testName = name;
				this._testMessage = message;
				this._testFn = fn;
				return this;
			})
		};
	});

	it('should pass when value is null', () => {
		maybeOption.call(schema, fieldName, validOptions);
		expect(schema._testFn(null)).toBe(true);
	});

	it('should pass when value is undefined', () => {
		maybeOption.call(schema, fieldName, validOptions);
		expect(schema._testFn(undefined)).toBe(true);
	});

	it('should pass when value is an array of valid options', () => {
		maybeOption.call(schema, fieldName, validOptions);
		expect(schema._testFn(['a', 'b'])).toBe(true);
		expect(schema._testFn(['a', 'b', 'c'])).toBe(true);
		expect(schema._testFn([])).toBe(true);
	});

	it('should fail when value is an array with invalid options', () => {
		maybeOption.call(schema, fieldName, validOptions);
		expect(schema._testFn(['a', 'd'])).toBe(false);
		expect(schema._testFn(['x'])).toBe(false);
	});

	it('should fail when value is not an array', () => {
		maybeOption.call(schema, fieldName, validOptions);
		expect(schema._testFn('a')).toBe(false);
		expect(schema._testFn(123)).toBe(false);
		expect(schema._testFn({})).toBe(false);
	});

	it('should set the correct test name and message', () => {
		maybeOption.call(schema, fieldName, validOptions);
		expect(schema._testName).toBe('maybeOption');
		expect(schema._testMessage).toBe(
			`${fieldName} must be one or more of the following values: ${validOptions.join(', ')}`
		);
	});
});
