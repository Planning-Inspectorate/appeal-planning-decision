const { mapDBResponseToJourneyResponseFormat } = require('./utils');

describe('mapDBResponseToJourneyResponseFormat', () => {
	it('should convert true to "yes" and false to "no"', () => {
		const dbResponse = {
			field1: true,
			field2: false,
			field3: 'other'
		};
		const result = mapDBResponseToJourneyResponseFormat(dbResponse);
		expect(result).toEqual({
			field1: 'yes',
			field2: 'no',
			field3: 'other'
		});
	});

	it('should handle empty object', () => {
		const dbResponse = {};
		const result = mapDBResponseToJourneyResponseFormat(dbResponse);
		expect(result).toEqual({});
	});

	it('should not convert non-boolean values', () => {
		const dbResponse = {
			field1: 0,
			field2: 1,
			field3: null,
			field4: undefined,
			field5: 'yes'
		};
		const result = mapDBResponseToJourneyResponseFormat(dbResponse);
		expect(result).toEqual({
			field1: 0,
			field2: 1,
			field3: null,
			field4: undefined,
			field5: 'yes'
		});
	});
});
