const { CASE_TYPES } = require('./database/data-static');
const { mapTypeCodeToAppealId } = require('./appeal-type-to-id');
const hasId = CASE_TYPES.HAS.id.toString();
const s78Id = CASE_TYPES.S78.id.toString();

describe('mapTypeCodeToAppealId', () => {
	it('errors for unknown type codes', () => {
		expect(() => mapTypeCodeToAppealId('unknown').toThrow('Unknown case type code: unknown'));
		expect(() => mapTypeCodeToAppealId(null).toThrow('Unknown case type code: null'));
		expect(() => mapTypeCodeToAppealId(undefined).toThrow('Unknown case type code: undefined'));
		expect(() => mapTypeCodeToAppealId('').toThrow('Unknown case type code: '));
		expect(() => mapTypeCodeToAppealId(true).toThrow('Unknown case type code: true'));
	});
	it('returns correct id as a string for correct type codes', () => {
		expect(mapTypeCodeToAppealId('HAS')).toBe(hasId);
		expect(mapTypeCodeToAppealId('S78')).toBe(s78Id);
		// add more type codes/ ids as they are added to CASE_TYPES
	});
});
