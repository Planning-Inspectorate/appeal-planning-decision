const { fullPostcodeRegex, partialPostcodeRegex, uuidRegex } = require('./regex');

describe('regexes', () => {
	describe('postcode regexes', () => {
		const badValues = [
			{
				base: 'a',
				expected: false
			},
			{
				base: 1,
				expected: false
			},
			{
				base: '',
				expected: false
			},
			{
				base: null,
				expected: false
			},
			{
				base: undefined,
				expected: false
			},
			{
				base: 'Definitely wrong',
				expected: false
			}
		];

		const fullPostCodeTests = [
			{
				base: 'A11 1AA',
				expected: true
			},
			{
				base: 'AA111AA',
				expected: true
			},
			{
				base: 'AA11AA',
				expected: true
			},
			{
				base: 'AA11 1AA',
				expected: true
			},
			{
				base: 'AA1 1AA',
				expected: true
			},
			{
				base: '11AAAA',
				expected: false
			},
			{
				base: '1A1 1AA',
				expected: false
			},
			{
				base: 'AA1 AA',
				expected: false
			},
			{
				base: 'AA1AA',
				expected: false
			},
			{
				base: 'AA 1AA',
				expected: false
			}
		];

		const partialTests = [
			{
				base: 'AA9A',
				expected: true
			},
			{
				base: 'A9A',
				expected: true
			},
			{
				base: 'A9',
				expected: true
			},
			{
				base: 'A99',
				expected: true
			},
			{
				base: 'AA9',
				expected: true
			},
			{
				base: 'AA99',
				expected: true
			},
			{
				base: '1A1',
				expected: false
			},
			{
				base: '12AAAA',
				expected: false
			},
			{
				base: 'AA9AA',
				expected: false
			},
			{
				base: 'AA',
				expected: false
			}
		];

		describe('fullPostcodeRegex', () => {
			it.each([...badValues, ...fullPostCodeTests])(
				'should validate postcode value "%s"',
				({ base, expected }) => {
					expect(fullPostcodeRegex.test(base)).toBe(expected);
				}
			);
		});

		describe('partialPostcodeRegex', () => {
			it.each([...badValues, ...partialTests])(
				'should validate partial postcode "%s"',
				({ base, expected }) => {
					expect(partialPostcodeRegex.test(base)).toBe(expected);
				}
			);

			it.each(fullPostCodeTests)('should not match full postcodes "%s"', ({ base }) => {
				expect(partialPostcodeRegex.test(base)).toBe(false);
			});
		});
	});

	describe('uuidRegex', () => {
		// Copied from uuid package: MIT license https://github.com/uuidjs/uuid/blob/main/LICENSE.md
		const uuids = [
			// constants
			{ value: '00000000-0000-0000-0000-000000000000', expectedValidate: true, expectedVersion: 0 },
			{
				value: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
				expectedValidate: true,
				expectedVersion: 15
			},

			// each version, with either all 0's or all 1's in settable bits
			{
				value: '00000000-0000-1000-8000-000000000000',
				expectedValidate: true,
				expectedVersion: 1
			},
			{
				value: 'ffffffff-ffff-1fff-8fff-ffffffffffff',
				expectedValidate: true,
				expectedVersion: 1
			},
			{
				value: '00000000-0000-2000-8000-000000000000',
				expectedValidate: true,
				expectedVersion: 2
			},
			{
				value: 'ffffffff-ffff-2fff-bfff-ffffffffffff',
				expectedValidate: true,
				expectedVersion: 2
			},
			{
				value: '00000000-0000-3000-8000-000000000000',
				expectedValidate: true,
				expectedVersion: 3
			},
			{
				value: 'ffffffff-ffff-3fff-bfff-ffffffffffff',
				expectedValidate: true,
				expectedVersion: 3
			},
			{
				value: '00000000-0000-4000-8000-000000000000',
				expectedValidate: true,
				expectedVersion: 4
			},
			{
				value: 'ffffffff-ffff-4fff-bfff-ffffffffffff',
				expectedValidate: true,
				expectedVersion: 4
			},
			{
				value: '00000000-0000-5000-8000-000000000000',
				expectedValidate: true,
				expectedVersion: 5
			},
			{
				value: 'ffffffff-ffff-5fff-bfff-ffffffffffff',
				expectedValidate: true,
				expectedVersion: 5
			},
			{
				value: '00000000-0000-6000-8000-000000000000',
				expectedValidate: true,
				expectedVersion: 6
			},
			{
				value: 'ffffffff-ffff-6fff-bfff-ffffffffffff',
				expectedValidate: true,
				expectedVersion: 6
			},
			{
				value: '00000000-0000-7000-8000-000000000000',
				expectedValidate: true,
				expectedVersion: 7
			},
			{
				value: 'ffffffff-ffff-7fff-bfff-ffffffffffff',
				expectedValidate: true,
				expectedVersion: 7
			},
			{
				value: '00000000-0000-8000-8000-000000000000',
				expectedValidate: true,
				expectedVersion: 8
			},
			{
				value: 'ffffffff-ffff-8fff-bfff-ffffffffffff',
				expectedValidate: true,
				expectedVersion: 8
			},
			{ value: '00000000-0000-9000-8000-000000000000', expectedValidate: false },
			{ value: 'ffffffff-ffff-9fff-bfff-ffffffffffff', expectedValidate: false },
			{ value: '00000000-0000-a000-8000-000000000000', expectedValidate: false },
			{ value: 'ffffffff-ffff-afff-bfff-ffffffffffff', expectedValidate: false },
			{ value: '00000000-0000-b000-8000-000000000000', expectedValidate: false },
			{ value: 'ffffffff-ffff-bfff-bfff-ffffffffffff', expectedValidate: false },
			{ value: '00000000-0000-c000-8000-000000000000', expectedValidate: false },
			{ value: 'ffffffff-ffff-cfff-bfff-ffffffffffff', expectedValidate: false },
			{ value: '00000000-0000-d000-8000-000000000000', expectedValidate: false },
			{ value: 'ffffffff-ffff-dfff-bfff-ffffffffffff', expectedValidate: false },
			{ value: '00000000-0000-e000-8000-000000000000', expectedValidate: false },
			{ value: 'ffffffff-ffff-efff-bfff-ffffffffffff', expectedValidate: false },

			// selection of normal, valid UUIDs
			{
				value: 'd9428888-122b-11e1-b85c-61cd3cbb3210',
				expectedValidate: true,
				expectedVersion: 1
			},
			{
				value: '000003e8-2363-21ef-b200-325096b39f47',
				expectedValidate: true,
				expectedVersion: 2
			},
			{
				value: 'a981a0c2-68b1-35dc-bcfc-296e52ab01ec',
				expectedValidate: true,
				expectedVersion: 3
			},
			{
				value: '109156be-c4fb-41ea-b1b4-efe1671c5836',
				expectedValidate: true,
				expectedVersion: 4
			},
			{
				value: '90123e1c-7512-523e-bb28-76fab9f2f73d',
				expectedValidate: true,
				expectedVersion: 5
			},
			{
				value: '1ef21d2f-1207-6660-8c4f-419efbd44d48',
				expectedValidate: true,
				expectedVersion: 6
			},
			{
				value: '017f22e2-79b0-7cc3-98c4-dc0c0c07398f',
				expectedValidate: true,
				expectedVersion: 7
			},
			{
				value: '0d8f23a0-697f-83ae-802e-48f3756dd581',
				expectedValidate: true,
				expectedVersion: 8
			},

			// all variant octet values
			{ value: '00000000-0000-1000-0000-000000000000', expectedValidate: false },
			{ value: '00000000-0000-1000-1000-000000000000', expectedValidate: false },
			{ value: '00000000-0000-1000-2000-000000000000', expectedValidate: false },
			{ value: '00000000-0000-1000-3000-000000000000', expectedValidate: false },
			{ value: '00000000-0000-1000-4000-000000000000', expectedValidate: false },
			{ value: '00000000-0000-1000-5000-000000000000', expectedValidate: false },
			{ value: '00000000-0000-1000-6000-000000000000', expectedValidate: false },
			{ value: '00000000-0000-1000-7000-000000000000', expectedValidate: false },
			{
				value: '00000000-0000-1000-8000-000000000000',
				expectedValidate: true,
				expectedVersion: 1
			},
			{
				value: '00000000-0000-1000-9000-000000000000',
				expectedValidate: true,
				expectedVersion: 1
			},
			{
				value: '00000000-0000-1000-a000-000000000000',
				expectedValidate: true,
				expectedVersion: 1
			},
			{
				value: '00000000-0000-1000-b000-000000000000',
				expectedValidate: true,
				expectedVersion: 1
			},
			{ value: '00000000-0000-1000-c000-000000000000', expectedValidate: false },
			{ value: '00000000-0000-1000-d000-000000000000', expectedValidate: false },
			{ value: '00000000-0000-1000-e000-000000000000', expectedValidate: false },
			{ value: '00000000-0000-1000-f000-000000000000', expectedValidate: false },

			// invalid strings
			{ value: '00000000000000000000000000000000', expectedValidate: false }, // unhyphenated NIL
			{ value: '', expectedValidate: false },
			{ value: 'invalid uuid string', expectedValidate: false },
			{
				value: '=Y00a-f*vb*-c-d#-p00f\b-g0h-#i^-j*3&-L00k-\nl---00n-fg000-00p-00r+',
				expectedValidate: false
			},

			// invalid types
			{ value: undefined, expectedValidate: false },
			{ value: null, expectedValidate: false },
			{ value: 123, expectedValidate: false },
			{ value: /regex/, expectedValidate: false },
			{ value: new Date(0), expectedValidate: false },
			{ value: false, expectedValidate: false }
		];

		it('should validate uuids', () => {
			for (const { value, expectedValidate } of uuids) {
				expect(uuidRegex.test(value)).toBe(expectedValidate);
			}
		});
	});
});
