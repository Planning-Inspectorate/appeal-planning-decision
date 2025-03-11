const { calculateDaysSinceInvalidated } = require('./calculate-days-since-invalidated');

describe('calculateDaysSinceInvalidated', () => {
	beforeAll(() => {
		jest.useFakeTimers('modern');
		jest.setSystemTime(new Date('2023-06-01T00:10:00.000Z').getTime());
	});

	it('returns negative number of days between current date and dateInvalidated when dateInvalidated is in future', () => {
		const dateInvalidated = new Date('2023-06-03T00:20:00.000Z');

		expect(calculateDaysSinceInvalidated(dateInvalidated)).toEqual(-2);
	});

	it('returns zero if current date and dateInvalidated are same day', () => {
		const dateInvalidated = new Date('2023-06-01T12:10:00.000Z');

		expect(calculateDaysSinceInvalidated(dateInvalidated)).toEqual(0);
	});

	it('returns positive number of days between current date and dateInvalidated when dateInvalidated is in past', () => {
		const dateInvalidated = new Date('2023-05-20T20:00:00.000Z');

		expect(calculateDaysSinceInvalidated(dateInvalidated)).toEqual(12);
	});
});
