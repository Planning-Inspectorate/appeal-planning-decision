const { formatAddress, formatUserContactAddressWithBreaks } = require('./format-address');

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

		it('takes an optional joinString when formatting address fields', () => {
			const testAddressData = {
				siteAddressLine1: 'Test Line 1',
				siteAddressLine2: 'Test Line 2',
				siteAddressTown: 'Test Town',
				siteAddressPostcode: 'TS1 1TS'
			};

			const expectedResult = 'Test Line 1\nTest Line 2\nTest Town\nTS1 1TS';

			expect(formatAddress(testAddressData, '\n')).toEqual(expectedResult);
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

	describe('formatUserContactAddressWithBreaks', () => {
		it('formats a user contact address fields into a string with line breaks', () => {
			const testUserData = {
				serviceUserType: 'Agent',
				firstName: 'Agent',
				lastName: 'Test',
				telephoneNumber: '98765',
				addressLine1: 'Test Line 1',
				addressLine2: null,
				addressTown: 'Test Town',
				postcode: 'TST ON3'
			};

			const expectedResult = 'Test Line 1\nTest Town\nTST ON3';

			expect(formatUserContactAddressWithBreaks(testUserData)).toEqual(expectedResult);
		});
	});
});
