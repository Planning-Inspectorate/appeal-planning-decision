const ApiError = require('../../../src/errors/apiError');

describe('ApiError', () => {
	const nonErrorFunctions = ['buildErrorFormat'];
	describe('static API errors work', () => {
		const errors = Object.getOwnPropertyNames(ApiError).filter(
			(prop) => !nonErrorFunctions.includes(prop) && typeof ApiError[prop] === 'function'
		);

		test.each(errors)('%s', (errorType) => {
			const result = ApiError[errorType]();
			expect(result).toBeInstanceOf(ApiError);
			expect(result).toBeInstanceOf(Error);
			expect(typeof result.code).toBe('number');
			expect(result.code.toString().length).toBe(3);
			expect(typeof result.message).toBe('string');
			expect(Array.isArray(result.errors)).toBe(true);
		});
	});
});
