const { capitalize } = require('./string-functions');

describe('string-functions', () => {
	describe('capitalize', () => {
		it(`returns a capitalised string`, () => {
			expect(capitalize('hello test')).toEqual('Hello test');
			expect(capitalize('Hello')).toEqual('Hello');
			expect(capitalize('a')).toEqual('A');
			expect(capitalize('hELLO')).toEqual('HELLO');
		});

		it(`returns an empty string if not given a string`, () => {
			expect(capitalize(['mock value'])).toEqual('');
			expect(capitalize(12345)).toEqual('');
			expect(capitalize({})).toEqual('');
			expect(capitalize(true)).toEqual('');
			expect(capitalize(null)).toEqual('');
			expect(capitalize(undefined)).toEqual('');
		});

		it('returns an empty string if given an empty string', () => {
			expect(capitalize('')).toEqual('');
		});
	});
});
