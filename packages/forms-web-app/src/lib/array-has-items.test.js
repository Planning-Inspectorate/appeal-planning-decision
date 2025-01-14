const { arrayHasItems } = require('./array-has-items');

describe('arrayHasItems', () => {
	it('should return false if input is not an array', () => {
		expect(arrayHasItems(null)).toBe(false);
		expect(arrayHasItems(undefined)).toBe(false);
		expect(arrayHasItems(123)).toBe(false);
		expect(arrayHasItems('string')).toBe(false);
		expect(arrayHasItems({})).toBe(false);
	});

	it('should return false for an empty array', () => {
		expect(arrayHasItems([])).toBe(false);
	});

	it('should return true for an array with items', () => {
		expect(arrayHasItems([1, 2, 3])).toBe(true);
		expect(arrayHasItems(['a', 'b', 'c'])).toBe(true);
	});
});
