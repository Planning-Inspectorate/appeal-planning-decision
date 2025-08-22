const monthMap = require('./month-map');

describe('monthMap', () => {
	it('should map month names and abbreviations to their corresponding month numbers', () => {
		expect(monthMap['jan']).toBe('1');
		expect(monthMap['january']).toBe('1');
		expect(monthMap['feb']).toBe('2');
		expect(monthMap['february']).toBe('2');
		expect(monthMap['mar']).toBe('3');
		expect(monthMap['march']).toBe('3');
		expect(monthMap['apr']).toBe('4');
		expect(monthMap['april']).toBe('4');
		expect(monthMap['may']).toBe('5');
		expect(monthMap['jun']).toBe('6');
		expect(monthMap['june']).toBe('6');
		expect(monthMap['jul']).toBe('7');
		expect(monthMap['july']).toBe('7');
		expect(monthMap['aug']).toBe('8');
		expect(monthMap['august']).toBe('8');
		expect(monthMap['sep']).toBe('9');
		expect(monthMap['september']).toBe('9');
		expect(monthMap['oct']).toBe('10');
		expect(monthMap['october']).toBe('10');
		expect(monthMap['nov']).toBe('11');
		expect(monthMap['november']).toBe('11');
		expect(monthMap['dec']).toBe('12');
		expect(monthMap['december']).toBe('12');
	});
});
