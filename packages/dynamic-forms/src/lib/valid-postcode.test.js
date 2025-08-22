const validatePostcode = require('./valid-postcode');

describe('validatePostcode', () => {
	it('confirms valid postcodes', () => {
		const validPostcodes = [
			'BN13 1LZ',
			'WA15 6AW',
			'B14 5UD',
			'Sk176NX',
			'NE33 4QL',
			'SA678JD',
			'HD1 4JA',
			'CO5 7LZ',
			'LU55dP',
			'BN17 6FY',
			'UB7 0JA',
			'BD8 8BH',
			'SE1 2TF',
			'BS23 3RS',
			'B359DZ',
			'dt11 7rl',
			'SP5 1QS',
			'PR6 8LD',
			'N21 2AS',
			'NE5 4BH',
			'FY5 2HE',
			'eh42 1DB',
			'BD9 5QJ',
			'PR3 1PL',
			'GL11 6HN'
		];

		validPostcodes.forEach((postcode) => {
			expect(validatePostcode(postcode)).toEqual(postcode);
		});
	});

	it('rejects invalid postcodes', () => {
		const invalidPostcodes = [
			'a',
			'1',
			'aaaaaa',
			'111111',
			'ABC 123',
			'123 ABC',
			'IP1 IP1',
			'2L XYZ'
		];

		invalidPostcodes.forEach((postcode) => {
			expect(() => {
				validatePostcode(postcode);
			}).toThrow('Enter a full UK postcode');
		});
	});

	it('can set custom error message', () => {
		expect(() => {
			validatePostcode('not a postcode', 'Custom error');
		}).toThrow('Custom error');
	});
});
