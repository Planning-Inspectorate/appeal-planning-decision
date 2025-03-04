const { calculateDueInDays } = require('./calculate-due-in-days');

describe('calculateDueInDays', () => {
	beforeAll(() => {
		jest.useFakeTimers('modern');
		jest.setSystemTime(new Date('2023-06-01T00:10:00.000Z').getTime());
	});

	it('returns positive number of days between current date and due date when due date is in future', () => {
		const dueDate = new Date('2023-06-03T00:20:00.000Z');

		expect(calculateDueInDays(dueDate)).toEqual(2);
	});

	it('returns zero if current date and due date are same day', () => {
		const dueDate = new Date('2023-06-01T12:10:00.000Z');

		expect(calculateDueInDays(dueDate)).toEqual(0);
	});

	it('returns negative number of days between current date and due date when due date is in past', () => {
		const dueDate = new Date('2023-05-20T20:00:00.000Z');

		expect(calculateDueInDays(dueDate)).toEqual(-12);
	});
});
