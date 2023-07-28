const { ukDateTimeFilter } = require('../../../src/view-filters/date-format-filter');

describe('ukDateTimeFilter', () => {
	it('should format a valid UTC date', () => {
		const date = '2023-07-28T12:00:00Z';
		const formattedDate = ukDateTimeFilter(date);
		expect(formattedDate).toBe('28 July 2023');
	});

	it('should format a valid zoned date', () => {
		const date = '2023-07-28T12:00:00+02:00';
		const formattedDate = ukDateTimeFilter(date);
		expect(formattedDate).toBe('28 July 2023');
	});

	it('should handle timezones by converting to UK local time', () => {
		const date = '2023-07-28T23:59:59Z';
		const formattedDate = ukDateTimeFilter(date);
		expect(formattedDate).toBe('29 July 2023');
	});

	it('should return an empty string for an invalid date', () => {
		const date = 'invalid_date';
		const formattedDate = ukDateTimeFilter(date);
		expect(formattedDate).toBe('');
	});

	it('should use the custom format provided', () => {
		const date = '2023-07-01T12:34:56Z';
		const formattedDate = ukDateTimeFilter(date, 'dd MMMM yyyy');
		expect(formattedDate).toBe('01 July 2023');
	});
});
