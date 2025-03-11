const { deadlineHasPassed } = require('./deadline-has-passed');

describe('deadlineHasPassed', () => {
	it('should return false when dueDate is undefined', () => {
		const result = deadlineHasPassed('');
		const result2 = deadlineHasPassed(undefined);
		const result3 = deadlineHasPassed(null);
		expect(result).toBe(false);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});
	it('should return true when the due date has passed', () => {
		const pastDate = new Date();
		pastDate.setDate(pastDate.getDate() - 1);
		const result = deadlineHasPassed(pastDate.toISOString());
		expect(result).toBe(true);
	});
	it('should return false when the due date is today', () => {
		const today = new Date().toISOString();
		const result = deadlineHasPassed(today);
		expect(result).toBe(false);
	});
	it('should return false when the due date is in the future', () => {
		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 1);
		const result = deadlineHasPassed(futureDate.toISOString());
		expect(result).toBe(false);
	});
});
