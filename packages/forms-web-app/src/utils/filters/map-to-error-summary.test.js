const { mapToErrorSummary } = require('./map-to-error-summary');

describe('mapToErrorSummary', () => {
	it('should return an array with a single error summary entry when given a string', () => {
		const errors = 'An error occurred';
		const result = mapToErrorSummary(errors);
		expect(result).toEqual([{ text: 'An error occurred', href: '#' }]);
	});

	it('should return the same array when given an array of error summary entries', () => {
		const errors = [
			{ text: 'Error 1', href: '#error1' },
			{ text: 'Error 2', href: '#error2' }
		];
		const result = mapToErrorSummary(errors);
		expect(result).toEqual(errors);
	});

	it('should return an array with a single error summary entry when given an error summary entry object', () => {
		const errors = { text: 'An error occurred', href: '#error' };
		const result = mapToErrorSummary(errors);
		expect(result).toEqual([errors]);
	});

	it('should map keyed errors to error summary entries', () => {
		const errors = {
			field1: { msg: 'Error in field 1' },
			field2: { msg: 'Error in field 2' }
		};
		const result = mapToErrorSummary(errors);
		expect(result).toEqual([
			{ text: 'Error in field 1', href: '#field1' },
			{ text: 'Error in field 2', href: '#field2' }
		]);
	});

	it('should handle empty error messages', () => {
		const errors = {
			field1: { msg: '' },
			field2: { msg: '' }
		};
		const result = mapToErrorSummary(errors);
		expect(result).toEqual([
			{ text: '', href: '#field1' },
			{ text: '', href: '#field2' }
		]);
	});

	it('should return an empty array when given an empty object', () => {
		const errors = {};
		const result = mapToErrorSummary(errors);
		expect(result).toEqual([]);
	});
});
