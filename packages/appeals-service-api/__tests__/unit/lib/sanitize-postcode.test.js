const sanitizePostcode = require('#lib/sanitize-postcode.js');

describe('sanitizePostcode', () => {
	it('removes whitespace from postcode', () => {
		const unsanitizedPostcode = 'BS1 6PN';
		expect(sanitizePostcode(unsanitizedPostcode)).toEqual('BS16PN');
	});
	it('converts postcode to uppercase', () => {
		const unsanitizedPostcode = 'ab12 3cd';
		expect(sanitizePostcode(unsanitizedPostcode)).toEqual('AB123CD');
	});
});
