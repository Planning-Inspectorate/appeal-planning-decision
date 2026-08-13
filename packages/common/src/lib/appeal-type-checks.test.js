const { CASE_TYPES } = require('../database/data-static');
const { isAnyEnforcement, isAnyEnforcementOrLDC } = require('./appeal-type-checks');

describe(isAnyEnforcement, () => {
	it.each([CASE_TYPES.ENFORCEMENT.processCode, CASE_TYPES.ENFORCEMENT_LISTED.processCode])(
		'returns true for %s',
		(appealType) => {
			expect(isAnyEnforcement(appealType)).toBe(true);
		}
	);

	it.each([
		CASE_TYPES.HAS.processCode,
		CASE_TYPES.S78.processCode,
		CASE_TYPES.S20.processCode,
		CASE_TYPES.ADVERTS.processCode,
		CASE_TYPES.CAS_ADVERTS.processCode,
		CASE_TYPES.CAS_PLANNING.processCode,
		CASE_TYPES.LDC.processCode
	])('returns false for %s', (appealType) => {
		expect(isAnyEnforcement(appealType)).toBe(false);
	});
});

describe(isAnyEnforcementOrLDC, () => {
	it.each([
		CASE_TYPES.ENFORCEMENT.processCode,
		CASE_TYPES.ENFORCEMENT_LISTED.processCode,
		CASE_TYPES.LDC.processCode
	])('returns true for %s', (appealType) => {
		expect(isAnyEnforcementOrLDC(appealType)).toBe(true);
	});

	it.each([
		CASE_TYPES.HAS.processCode,
		CASE_TYPES.S78.processCode,
		CASE_TYPES.S20.processCode,
		CASE_TYPES.ADVERTS.processCode,
		CASE_TYPES.CAS_ADVERTS.processCode,
		CASE_TYPES.CAS_PLANNING.processCode
	])('returns false for %s', (appealType) => {
		expect(isAnyEnforcementOrLDC(appealType)).toBe(false);
	});
});
