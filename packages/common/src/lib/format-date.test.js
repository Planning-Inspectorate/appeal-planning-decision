const { formatDateForDisplay, parseDateInput, convertUTCToUK } = require('./format-date');

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

	describe('parseDateInput', () => {
		const tests = [
			{ input: { year: 2024, month: 2, day: 20 }, expected: new Date('2024-02-20T00:00:00.000Z') },
			{
				input: { year: 2024, month: 9, day: 30, hour: 21, minute: 0 },
				expected: new Date('2024-09-30T20:00:00.000Z')
			},
			{
				input: { year: 2024, month: 10, day: 1, hour: 0, minute: 59 },
				expected: new Date('2024-09-30T23:59:00.000Z')
			}
		];

		it.each(tests)('parses date $date in Europe/London', ({ input, expected }) => {
			expect(parseDateInput(input)).toEqual(expected);
		});
	});

	describe('convertUTCToUK', () => {
		const tests = [
			{ date: '2024-02-20T15:00:00.000Z', expected: 15 },
			{ date: '2024-09-30T20:00:00.000Z', expected: 21 }
		];

		it.each(tests)('converts $date to Europe/London', ({ date, expected }) => {
			expect(convertUTCToUK(date).getHours()).toEqual(expected);
		});
	});
});
