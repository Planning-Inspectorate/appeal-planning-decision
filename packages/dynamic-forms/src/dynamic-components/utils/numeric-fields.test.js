const { numericFields } = require('./numeric-fields');

describe('numericFields', () => {
	it('should contain specific numeric field names', () => {
		expect(numericFields.has('siteAreaSquareMetres')).toBe(true);
		expect(numericFields.has('appellantPreferInquiryDuration')).toBe(true);
		expect(numericFields.has('appellantPreferInquiryWitnesses')).toBe(true);
	});

	it('should not contain other field names', () => {
		expect(numericFields.has('nonExistentField')).toBe(false);
	});
});
