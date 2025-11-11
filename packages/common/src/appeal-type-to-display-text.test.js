const { CASE_TYPES } = require('./database/data-static');
const { mapAppealTypeToDisplayText } = require('./appeal-type-to-display-text');

describe('mapAppealTypeToDisplayText', () => {
	it('returns undefined for unknown appeal types', () => {
		expect(mapAppealTypeToDisplayText('unknown')).toBe(undefined);
		expect(mapAppealTypeToDisplayText(null)).toBe(undefined);
		expect(mapAppealTypeToDisplayText(undefined)).toBe(undefined);
		expect(mapAppealTypeToDisplayText('')).toBe(undefined);
		expect(mapAppealTypeToDisplayText(true)).toBe(undefined);
	});

	it('returns correct display text as a string for correct type codes', () => {
		expect(mapAppealTypeToDisplayText(CASE_TYPES.HAS)).toBe('householder');
		expect(mapAppealTypeToDisplayText(CASE_TYPES.S78)).toBe('planning');
		expect(mapAppealTypeToDisplayText(CASE_TYPES.S20)).toBe(
			'planning listed building and conservation area'
		);
		expect(mapAppealTypeToDisplayText(CASE_TYPES.CAS_PLANNING)).toBe('commercial planning (CAS)');
		expect(mapAppealTypeToDisplayText(CASE_TYPES.CAS_ADVERTS)).toBe('commercial advertisement');
		expect(mapAppealTypeToDisplayText(CASE_TYPES.ADVERTS)).toBe('advertisement');
		expect(mapAppealTypeToDisplayText(CASE_TYPES.ENFORCEMENT)).toBe('enforcement notice');
		// add more type codes/ ids as they are added to CASE_TYPES
	});
});
