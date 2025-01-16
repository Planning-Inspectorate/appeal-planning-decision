const { fullPostcodeRegex, partialPostcodeRegex } = require('./regex');

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
	// {
	// 	base: '1A1 1AA',
	// 	expected: false
	// },
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

describe('postcode regexes', () => {
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
