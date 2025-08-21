const { dateInputsToDate } = require('./date-inputs-to-date');

describe('dateInputsToDate', () => {
	it('converts inputs to a date object', () => {
		const expectedResult = new Date(2022, 11, 1);
		expect(dateInputsToDate('1', '12', '2022')).toEqual(expectedResult);
	});
});
