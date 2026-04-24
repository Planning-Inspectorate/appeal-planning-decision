const { chunkArray, runBatchWithPromise } = require('./chunk-array');

describe('chunk-array utilities', () => {
	describe('chunkArray', () => {
		it('should chunk an array into equal parts', () => {
			const array = [1, 2, 3, 4, 5, 6];
			const result = chunkArray(array, 2);

			expect(result).toEqual([
				[1, 2],
				[3, 4],
				[5, 6]
			]);
			expect(result.length).toBe(3);
		});

		it('should chunk an array with remainder', () => {
			const array = [1, 2, 3, 4, 5];
			const result = chunkArray(array, 2);

			expect(result).toEqual([[1, 2], [3, 4], [5]]);
			expect(result.length).toBe(3);
		});

		it('should handle chunk size larger than array', () => {
			const array = [1, 2, 3];
			const result = chunkArray(array, 10);

			expect(result).toEqual([[1, 2, 3]]);
			expect(result.length).toBe(1);
		});

		it('should handle chunk size of 1', () => {
			const array = [1, 2, 3];
			const result = chunkArray(array, 1);

			expect(result).toEqual([[1], [2], [3]]);
			expect(result.length).toBe(3);
		});

		it('should handle empty array', () => {
			const array = [];
			const result = chunkArray(array, 2);

			expect(result).toEqual([]);
			expect(result.length).toBe(0);
		});

		it('should handle single item', () => {
			const array = [42];
			const result = chunkArray(array, 2);

			expect(result).toEqual([[42]]);
			expect(result.length).toBe(1);
		});

		it('should work with different data types', () => {
			const array = ['a', 'b', 'c', 'd'];
			const result = chunkArray(array, 2);

			expect(result).toEqual([
				['a', 'b'],
				['c', 'd']
			]);
		});

		it('should work with objects', () => {
			const array = [{ id: 1 }, { id: 2 }, { id: 3 }];
			const result = chunkArray(array, 2);

			expect(result).toEqual([[{ id: 1 }, { id: 2 }], [{ id: 3 }]]);
		});
	});

	describe('runBatchWithPromise', () => {
		it('should execute all batches and return results', async () => {
			const batch = [
				[1, 2],
				[3, 4],
				[5, 6]
			];
			const fn = async (chunk) => chunk.reduce((sum, n) => sum + n, 0);

			const result = await runBatchWithPromise(batch, 2, fn);

			expect(result).toEqual([3, 7, 11]);
		});

		it('should handle empty batch', async () => {
			const batch = [];
			const fn = async (chunk) => chunk;

			const result = await runBatchWithPromise(batch, 2, fn);

			expect(result).toEqual([]);
		});

		it('should handle single batch', async () => {
			const batch = [[1, 2, 3]];
			const fn = async (chunk) => chunk;

			const result = await runBatchWithPromise(batch, 2, fn);

			expect(result).toEqual([1, 2, 3]);
		});

		it('should handle concurrency limit of 1', async () => {
			const batch = [[1], [2], [3]];
			const concurrencyTracker = { concurrent: 0, maxConcurrent: 0 };

			const fn = async (chunk) => {
				concurrencyTracker.concurrent++;
				concurrencyTracker.maxConcurrent = Math.max(
					concurrencyTracker.maxConcurrent,
					concurrencyTracker.concurrent
				);

				await new Promise((resolve) => setTimeout(resolve, 5));
				concurrencyTracker.concurrent--;

				return chunk[0] * 2;
			};

			const result = await runBatchWithPromise(batch, 1, fn);

			expect(result).toEqual([2, 4, 6]);
			expect(concurrencyTracker.maxConcurrent).toBe(1);
		});

		it('should flatten results correctly', async () => {
			const batch = [
				[1, 2],
				[3, 4]
			];
			const fn = async (chunk) => chunk; // returns arrays

			const result = await runBatchWithPromise(batch, 2, fn);

			expect(result).toEqual([1, 2, 3, 4]);
		});

		it('should handle async errors in function', async () => {
			const batch = [[1], [2]];
			const fn = async (chunk) => {
				if (chunk[0] === 2) {
					throw new Error('Test error');
				}
				return chunk[0];
			};

			await expect(runBatchWithPromise(batch, 1, fn)).rejects.toThrow('Test error');
		});

		it('should process batches in order', async () => {
			const batch = [[1], [2], [3], [4], [5]];
			const executionOrder = [];

			const fn = async (chunk) => {
				executionOrder.push(chunk[0]);
				return chunk[0];
			};

			await runBatchWithPromise(batch, 2, fn);

			expect(executionOrder).toEqual([1, 2, 3, 4, 5]);
		});

		it('should work with objects as batch items', async () => {
			const batch = [[{ id: 1 }], [{ id: 2 }]];
			const fn = async (chunk) => chunk.map((item) => item.id);

			const result = await runBatchWithPromise(batch, 2, fn);

			expect(result).toEqual([1, 2]);
		});
	});
});
