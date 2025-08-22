const formatNumber = require('./format-number');

describe('format-number', () => {
	it('should format 100 as 100', () => {
		expect(formatNumber('100')).toBe('100');
	});

	it('should format 1000 as 1,000', () => {
		expect(formatNumber('1000')).toBe('1,000');
	});

	it('should format 32500 as 32,500', () => {
		expect(formatNumber('32500')).toBe('32,500');
	});

	it('should format 32500000 as 32,500,000', () => {
		expect(formatNumber('32500000')).toBe('32,500,000');
	});
});
