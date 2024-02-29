import { isEmailLike } from './email.js';

describe('validators/email', () => {
	describe('isEmailLike', () => {
		it('should return true when string contains "@"', async () => {
			const result = isEmailLike('@');
			expect(result).toBe(true);
		});

		it('should return false when string does not contain "@"', async () => {
			const result = isEmailLike('test');
			expect(result).toBe(false);

			const result2 = isEmailLike('');
			expect(result2).toBe(false);
		});

		it('should return error when not a string', async () => {
			expect(() => isEmailLike({})).toThrow();
			expect(() => isEmailLike(null)).toThrow();
			expect(() => isEmailLike(undefined)).toThrow();
			expect(() => isEmailLike(1)).toThrow();
		});
	});
});
