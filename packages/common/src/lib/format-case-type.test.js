const { caseTypeNameWithDefault } = require('./format-case-type');
const { CASE_TYPES } = require('../database/data-static');

describe('format-case-type:', () => {
	describe('caseTypeNameWithDefault', () => {
		it('returns empty string for falsy values', () => {
			expect(caseTypeNameWithDefault('')).toEqual('');
			expect(caseTypeNameWithDefault(null)).toEqual('');
			expect(caseTypeNameWithDefault(undefined)).toEqual('');
		});

		it('returns empty string for unknown case type', () => {
			expect(caseTypeNameWithDefault('not a real case type')).toEqual('');
		});

		const CASE_TYPES_ARRAY = Object.values(CASE_TYPES);
		it.each([CASE_TYPES_ARRAY])('looks up case type: %s', async (caseType) => {
			expect(caseTypeNameWithDefault(caseType.processCode)).toEqual(caseType.type);
		});
	});
});
