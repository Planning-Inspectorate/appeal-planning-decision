import { isNonEmptyString } from './string.js';

describe('validators/string', () => {
	describe('isNonEmptyString', () => {
		it('should return true when string', async () => {
			const result = isNonEmptyString('abc');
			expect(result).toBe(true);
		});

		it('should return false when string is empty', async () => {
			const result = isNonEmptyString('');
			expect(result).toBe(false);

			const result2 = isNonEmptyString(' ');
			expect(result2).toBe(false);
		});

		it('should return false when not a string', async () => {
			const result = isNonEmptyString(1);
			expect(result).toBe(false);

			const result2 = isNonEmptyString({});
			expect(result2).toBe(false);

			const result3 = isNonEmptyString(null);
			expect(result3).toBe(false);

			const result4 = isNonEmptyString(undefined);
			expect(result4).toBe(false);
		});
	});
});
