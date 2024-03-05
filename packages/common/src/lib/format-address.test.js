const { formatAddress, formatAddressWithBreaks } = require('./format-address');

describe('Address Formatting:', () => {
	describe('formatAddress', () => {
		it('formats address fields into a string', () => {
			const testAddressData = {
				siteAddressLine1: 'Test Line 1',
				siteAddressLine2: 'Test Line 2',
				siteAddressTown: 'Test Town',
				siteAddressPostcode: 'TS1 1TS'
			};

			const expectedResult = 'Test Line 1, Test Line 2, Test Town, TS1 1TS';

			expect(formatAddress(testAddressData)).toEqual(expectedResult);
		});

		it('handles missing fields', () => {
			const testAddressData = {
				siteAddressLine1: 'Test Line 1',
				siteAddressLine2: '',
				siteAddressTown: 'Test Town',
				siteAddressPostcode: 'TS1 1TS'
			};

			const expectedResult = 'Test Line 1, Test Town, TS1 1TS';

			expect(formatAddress(testAddressData)).toEqual(expectedResult);
		});

		it('formats the address fields in a submission', () => {
			const testSubmissionAddressData = {
				appeal: {
					appealSiteSection: {
						siteAddress: {
							addressLine1: 'Test Line 1',
							addressLine2: 'Test Line 2',
							town: 'Test Town',
							postcode: 'TS1 1TS'
						}
					}
				}
			};

			const expectedResult = 'Test Line 1, Test Line 2, Test Town, TS1 1TS';

			expect(formatAddress(testSubmissionAddressData)).toEqual(expectedResult);
		});
	});

	describe('formatAddressWithBreaks', () => {
		it('format address fields into a string separated by html line breaks', () => {
			const testAddressData = {
				siteAddressLine1: 'Test Line 1',
				siteAddressLine2: 'Test Line 2',
				siteAddressTown: 'Test Town',
				siteAddressPostcode: 'TS1 1TS'
			};

			const expectedResult = 'Test Line 1<br>Test Line 2<br>Test Town<br>TS1 1TS';

			expect(formatAddressWithBreaks(testAddressData)).toEqual(expectedResult);
		});
	});
});
