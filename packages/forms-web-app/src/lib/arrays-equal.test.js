const { arraysEqual } = require('./arrays-equal');

describe('arraysEqual', () => {
	it('should return true for equal arrays', () => {
		const arr1 = [1, 2, 3];
		const arr2 = [1, 2, 3];
		expect(arraysEqual(arr1, arr2)).toBe(true);
	});

	it('should return false for arrays with different lengths', () => {
		const arr1 = [1, 2, 3];
		const arr2 = [1, 2];
		expect(arraysEqual(arr1, arr2)).toBe(false);
	});

	it('should return false for arrays with different elements', () => {
		const arr1 = [1, 2, 3];
		const arr2 = [1, 2, 4];
		expect(arraysEqual(arr1, arr2)).toBe(false);
	});

	it('should return true for empty arrays', () => {
		const arr1 = [];
		const arr2 = [];
		expect(arraysEqual(arr1, arr2)).toBe(true);
	});

	it('should return false for arrays with same elements in different order', () => {
		const arr1 = [1, 2, 3];
		const arr2 = [3, 2, 1];
		expect(arraysEqual(arr1, arr2)).toBe(false);
	});
});
