const { buildQueryString } = require('./utils');

describe('client utils', () => {
	describe('buildQueryString', () => {
		const tests = [
			{
				name: 'empty',
				params: {},
				suffix: ''
			},
			{
				name: 'few params',
				params: { a: 1, b: 'two', c: true },
				suffix: '?a=1&b=two&c=true'
			}
		];
		for (const { name, params, suffix } of tests) {
			it(name, () => {
				const got = buildQueryString(params);
				expect(got).toEqual(suffix);
			});
		}
	});
});
