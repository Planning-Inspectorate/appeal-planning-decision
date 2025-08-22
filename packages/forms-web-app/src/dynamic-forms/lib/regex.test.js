const { fullPostcodeRegex } = require('./regex');

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

describe('postcode regexes', () => {
	describe('fullPostcodeRegex', () => {
		it.each([...badValues, ...fullPostCodeTests])(
			'should validate postcode value "%s"',
			({ base, expected }) => {
				expect(fullPostcodeRegex.test(base)).toBe(expected);
			}
		);
	});
});
