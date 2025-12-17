// @ts-ignore - not sure why this is erroring, we want to explicitly support .ts files
import { msToDurationString } from '#lib/duration.ts';

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
