const { getPersistedNumberAnswer } = require('./persisted-number-answer');

describe('getPersistedNumberAnswer', () => {
	it('should return "0" when the answer is 0', () => {
		expect(getPersistedNumberAnswer(0)).toBe('0');
	});

	it('should return the number when the answer is a non-zero number', () => {
		expect(getPersistedNumberAnswer(42)).toBe(42);
		expect(getPersistedNumberAnswer(-1)).toBe(-1);
	});

	it('should return an empty string when the answer is undefined', () => {
		expect(getPersistedNumberAnswer(undefined)).toBe('');
	});

	it('should return an empty string when the answer is null', () => {
		expect(getPersistedNumberAnswer(null)).toBe('');
	});

	it('should return an empty string when the answer is not a number', () => {
		expect(getPersistedNumberAnswer('string')).toBe('');
		expect(getPersistedNumberAnswer({})).toBe('');
		expect(getPersistedNumberAnswer([])).toBe('');
	});
});
