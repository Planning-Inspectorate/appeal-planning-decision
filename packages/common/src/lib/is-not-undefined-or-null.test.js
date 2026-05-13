const { isNotUndefinedOrNull, isUndefinedOrNull } = require('./is-not-undefined-or-null');

describe('is-not-undefined-or-null', () => {
	describe('isUndefinedOrNull', () => {
		it('returns true for undefined', () => {
			expect(isUndefinedOrNull(undefined)).toBe(true);
		});

		it('returns true for null', () => {
			expect(isUndefinedOrNull(null)).toBe(true);
		});

		it('returns false for 0', () => {
			expect(isUndefinedOrNull(0)).toBe(false);
		});

		it('returns false for empty string', () => {
			expect(isUndefinedOrNull('')).toBe(false);
		});

		it('returns false for false', () => {
			expect(isUndefinedOrNull(false)).toBe(false);
		});

		it('returns false for a value', () => {
			expect(isUndefinedOrNull('hello')).toBe(false);
		});
	});

	describe('isNotUndefinedOrNull', () => {
		it('returns false for undefined', () => {
			expect(isNotUndefinedOrNull(undefined)).toBe(false);
		});

		it('returns false for null', () => {
			expect(isNotUndefinedOrNull(null)).toBe(false);
		});

		it('returns true for 0', () => {
			expect(isNotUndefinedOrNull(0)).toBe(true);
		});

		it('returns true for empty string', () => {
			expect(isNotUndefinedOrNull('')).toBe(true);
		});

		it('returns true for false', () => {
			expect(isNotUndefinedOrNull(false)).toBe(true);
		});

		it('returns true for a value', () => {
			expect(isNotUndefinedOrNull('hello')).toBe(true);
		});
	});
});
