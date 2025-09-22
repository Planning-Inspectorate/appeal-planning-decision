import { getJsonArray, numberWithDefault } from './config-helpers.js';

describe('config-helpers', () => {
	describe('numberWithDefault', () => {
		it('parses valid numbers and falls back on invalid', () => {
			expect(numberWithDefault('123', 5)).toBe(123);
			expect(numberWithDefault(undefined, 5)).toBe(5);
			expect(numberWithDefault('abc', 7)).toBe(7);
		});
	});

	describe('getJsonArray', () => {
		const KEY = 'UNIT_TEST_JSON_ARRAY';
		afterEach(() => {
			delete process.env[KEY];
		});

		it('throws when env var missing', () => {
			expect(() => getJsonArray(KEY)).toThrow(`${KEY} is required`);
		});

		it('parses valid json array', () => {
			process.env[KEY] = '[1,2,3]';
			expect(getJsonArray(KEY)).toEqual([1, 2, 3]);
		});

		it('validates array item types when typeCheck provided', () => {
			process.env[KEY] = '["a","b"]';
			expect(getJsonArray(KEY, 'string')).toEqual(['a', 'b']);
			process.env[KEY] = '[1, "b"]';
			expect(() => getJsonArray(KEY, 'string')).toThrow(`${KEY} must be an array of string`);
		});

		it('throws when not an array', () => {
			process.env[KEY] = '{"a":1}';
			expect(() => getJsonArray(KEY)).toThrow(`${KEY} must be a json array`);
		});
	});
});
