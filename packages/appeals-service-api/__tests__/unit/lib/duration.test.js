const { msToDurationString } = require('#lib/duration');

describe('duration', () => {
	describe('msToDurationString', () => {
		const tests = [
			{
				ms: 0,
				str: '0'
			},
			{
				ms: 100,
				str: '100ms'
			},
			{
				ms: 10000,
				str: '10s'
			},
			{
				ms: 60_000,
				str: '1min'
			},
			{
				ms: 126_000,
				str: '2mins 6s'
			}
		];

		test.each(tests)('$ms', ({ ms, str }) => {
			const got = msToDurationString(ms);
			expect(got).toEqual(str);
		});
	});
});
