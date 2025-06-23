const { encodeUrlSlug } = require('../../../src/lib/encode');

describe('lib/encode', () => {
	describe('encodeUrlSlug', () => {
		it(`should handle bad values without throwing error`, () => {
			const badVals = [null, undefined, 1, '12/12/2000', 'a', [1, 2]];

			badVals.forEach((item) => {
				expect(() => encodeUrlSlug(item)).not.toThrow();
			});
		});

		it(`should call encodeURIComponent`, () => {
			jest.spyOn(global, 'encodeURIComponent');
			encodeUrlSlug('@?');
			expect(encodeURIComponent).toHaveBeenCalledWith('@?');
		});
	});
});
