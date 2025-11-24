const { retryAsync } = require('./retry-async');

const delayMs = 1;

describe('retryAsync', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('successful execution', () => {
		it('should return the result when function succeeds on first attempt', async () => {
			const mockFn = jest.fn().mockResolvedValue('success');

			const result = await retryAsync(mockFn);

			expect(result).toBe('success');
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should return the result when function succeeds after retries', async () => {
			const mockFn = jest
				.fn()
				.mockRejectedValueOnce(new Error('fail 1'))
				.mockResolvedValue('success');

			const result = await retryAsync(mockFn, delayMs);

			expect(result).toBe('success');
			expect(mockFn).toHaveBeenCalledTimes(2);
		});
	});

	describe('retry behavior', () => {
		it('should retry the specified number of times before throwing', async () => {
			const mockFn = jest.fn().mockRejectedValue(new Error('always fails'));

			await expect(retryAsync(mockFn, delayMs, 2)).rejects.toThrow('always fails');
			expect(mockFn).toHaveBeenCalledTimes(2);
		});

		it('should use default maxRetries of 3 when not specified', async () => {
			const mockFn = jest.fn().mockRejectedValue(new Error('always fails'));

			await expect(retryAsync(mockFn, delayMs)).rejects.toThrow('always fails');
			expect(mockFn).toHaveBeenCalledTimes(3);
		});

		it('should limit maxRetries to 5 even when higher value is passed', async () => {
			const mockFn = jest.fn().mockRejectedValue(new Error('always fails'));

			await expect(retryAsync(mockFn, delayMs, 10)).rejects.toThrow('always fails');
			expect(mockFn).toHaveBeenCalledTimes(5);
		});
	});

	describe('callback functionality', () => {
		it('should call logOnRetryFn when provided', async () => {
			const mockFn = jest
				.fn()
				.mockRejectedValueOnce(new Error('fail 1'))
				.mockRejectedValueOnce(new Error('fail 2'))
				.mockResolvedValue('success');
			const logCallback = jest.fn();

			await retryAsync(mockFn, delayMs, 3, logCallback);

			expect(logCallback).toHaveBeenCalledTimes(2);
			expect(logCallback).toHaveBeenCalledWith(new Error('fail 1'), 1);
			expect(logCallback).toHaveBeenCalledWith(new Error('fail 2'), 2);
		});

		it('should not call logOnRetryFn when function succeeds', async () => {
			const mockFn = jest.fn().mockResolvedValue('success');
			const logCallback = jest.fn();

			await retryAsync(mockFn, delayMs, 1, logCallback);

			expect(logCallback).not.toHaveBeenCalled();
		});

		it('should work without logOnRetryFn callback', async () => {
			const mockFn = jest
				.fn()
				.mockRejectedValueOnce(new Error('fail'))
				.mockResolvedValue('success');

			const result = await retryAsync(mockFn, delayMs);

			expect(result).toBe('success');
		});
	});

	describe('error handling', () => {
		it('should throw the original error when max retries exceeded', async () => {
			const originalError = new Error('original error');
			const mockFn = jest.fn().mockRejectedValue(originalError);

			await expect(retryAsync(mockFn, delayMs, 1)).rejects.toBe(originalError);
		});

		it('should handle non-Error objects being thrown', async () => {
			const mockFn = jest.fn().mockRejectedValue('string error');
			const logCallback = jest.fn();

			await expect(retryAsync(mockFn, delayMs, 2, logCallback)).rejects.toBe('string error');
			expect(logCallback).toHaveBeenCalledWith('string error', 1);
		});
	});

	describe('parameter validation', () => {
		it('should handle zero retries', async () => {
			const mockFn = jest.fn().mockRejectedValue(new Error('fail'));

			await expect(retryAsync(mockFn, delayMs, 0)).rejects.toThrow('fail');
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should handle negative retries', async () => {
			const mockFn = jest.fn().mockRejectedValue(new Error('fail'));

			await expect(retryAsync(mockFn, delayMs, -1)).rejects.toThrow('fail');
			expect(mockFn).toHaveBeenCalledTimes(1);
		});
	});
});
