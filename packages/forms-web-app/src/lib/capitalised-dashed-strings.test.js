const { removeDashesAndCapitaliseString } = require('./capitalised-dashed-strings');

describe('lib/capitalised-dashed-strings', () => {
	describe('removeDashesAndCapitaliseString', () => {
		it('returns empty string if no text provided', () => {
			const result = removeDashesAndCapitaliseString('');
			expect(result).toEqual('');
		});
		it('handles a single word', () => {
			const result = removeDashesAndCapitaliseString('test');
			expect(result).toEqual('Test');
		});

		it('handles multiple words', () => {
			const result = removeDashesAndCapitaliseString('removal-or-variation-of-conditions');
			expect(result).toEqual('Removal or variation of conditions');
		});
	});
});
