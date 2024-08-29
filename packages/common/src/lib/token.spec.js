const { createToken } = require('./token');

describe('lib/token', () => {
	describe('createToken', () => {
		it('should return a token as a string, 5 characters in length, containing only digits, and containing no zeros', async () => {
			const tokenValidationRegex = new RegExp(/^[\w_]{5}$/g);
			const vowelOmissionValidationRegex = new RegExp(/^[AEIOUaeiou0-9]{5}$/g);

			for (let i = 0; i < 1000; i++) {
				const token = createToken();
				console.log(token);

				expect(typeof token).toBe('string');
				expect(token.length).toBe(5);

				const tokenMatchResult = token.match(tokenValidationRegex);
				const vowelOmissionResult = token.match(vowelOmissionValidationRegex);

				expect(tokenMatchResult).not.toBe(null);
				expect(tokenMatchResult).toEqual([`${token}`]);
				expect(vowelOmissionResult).toBe(null);
			}
		});
	});
});
