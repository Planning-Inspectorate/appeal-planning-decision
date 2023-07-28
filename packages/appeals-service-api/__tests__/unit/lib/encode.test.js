const { encodeUrlSlug, decodeUrlSlug } = require('../../../src/lib/encode');

describe('lib/encode', () => {
	describe('encodeUrlSlug', () => {
		it(`should handle bad values without throwing error`, () => {
			const badVals = [null, undefined, 1, '12/12/2000', 'a', [1, 2]];

			badVals.forEach((item) => {
				expect(() => encodeUrlSlug(item)).not.toThrow();
			});
		});

		it(`should replace all / chars`, () => {
			const res = encodeUrlSlug('/a/a/');
			expect(res).toEqual('_a_a_');
		});

		it(`should call encodeURIComponent`, () => {
			jest.spyOn(global, 'encodeURIComponent');
			encodeUrlSlug('@?');
			expect(encodeURIComponent).toBeCalledWith('@?');
		});
	});

	describe('decodeUrlSlug', () => {
		it(`should decode url slug`, () => {
			const input = '/a@a/';
			const encoded = encodeUrlSlug(input);
			const decoded = decodeUrlSlug(encoded);
			expect(encoded).not.toEqual(decoded);
			expect(decoded).toEqual(input);
		});

		it(`will fail if original ref contains _`, () => {
			const input = '/_';
			const encoded = encodeUrlSlug(input);
			const decoded = decodeUrlSlug(encoded);
			expect(encoded).not.toEqual(decoded);
			expect(decoded).not.toEqual(input);
			expect(decoded).toEqual('//');
		});
	});
});
