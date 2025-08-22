const { formatDateForDisplay } = require('./format-date');

describe('format-date', () => {
	describe('formatUTCDateToUK', () => {
		const tests = [
			{ date: new Date('2024-02-20T15:00Z'), expected: '20 Feb 2024 - 15 00' },
			{ date: new Date('2024-09-30T20:00Z'), expected: '30 Sep 2024 - 21 00' },
			{ date: new Date('2024-09-30T23:59Z'), expected: '1 Oct 2024 - 00 59' },
			{ date: '2024-02-20T15:00:00.000Z', expected: '20 Feb 2024 - 15 00' },
			{ date: '2024-09-30T20:00:00.000Z', expected: '30 Sep 2024 - 21 00' },
			{ date: '2024-09-30T23:59:00.000Z', expected: '1 Oct 2024 - 00 59' }
		];

		it.each(tests)('formats date $date in Europe/London', ({ date, expected }) => {
			expect(formatDateForDisplay(date, { format: 'd MMM yyyy - HH mm' })).toEqual(expected);
		});

		const badInputTests = [
			{ date: undefined, expected: '' },
			{ date: null, expected: '' },
			{ date: 'nope', expected: '' }
		];

		it.each(badInputTests)('returns empty string for bad value: $date', ({ date, expected }) => {
			expect(formatDateForDisplay(date)).toEqual(expected);
		});
	});
});
