const { chunkArray } = require('./chunk-array');

describe('chunkArray', () => {
	it('splits an array into equal chunks', () => {
		const arr = [1, 2, 3, 4, 5, 6];
		expect(chunkArray(arr, 2)).toEqual([
			[1, 2],
			[3, 4],
			[5, 6]
		]);
	});

	it('last chunk is smaller if not divisible', () => {
		const arr = [1, 2, 3, 4, 5];
		expect(chunkArray(arr, 2)).toEqual([[1, 2], [3, 4], [5]]);
	});

	it('returns the whole array as one chunk if chunk_size >= array length', () => {
		const arr = [1, 2, 3];
		expect(chunkArray(arr, 3)).toEqual([[1, 2, 3]]);
		expect(chunkArray(arr, 10)).toEqual([[1, 2, 3]]);
	});

	it('returns empty array if input is empty', () => {
		expect(chunkArray([], 2)).toEqual([]);
	});

	it('handles chunk_size of 1', () => {
		const arr = [1, 2, 3];
		expect(chunkArray(arr, 1)).toEqual([[1], [2], [3]]);
	});

	it('works with arrays of objects', () => {
		const arr = [{ a: 1 }, { a: 2 }, { a: 3 }];
		expect(chunkArray(arr, 2)).toEqual([[{ a: 1 }, { a: 2 }], [{ a: 3 }]]);
	});

	it('throws error if chunk_size <= 0', () => {
		const arr = [1, 2, 3];
		expect(() => chunkArray(arr, 0)).toThrow('chunk_size must be a positive number');
		expect(() => chunkArray(arr, -1)).toThrow('chunk_size must be a positive number');
		// @ts-ignore
		expect(() => chunkArray(arr, 'a')).toThrow('chunk_size must be a positive number');
	});

	it('throws error if not an array', () => {
		const arr = {};
		// @ts-ignore
		expect(() => chunkArray(arr, 2)).toThrow('array must be an array');
	});
});
