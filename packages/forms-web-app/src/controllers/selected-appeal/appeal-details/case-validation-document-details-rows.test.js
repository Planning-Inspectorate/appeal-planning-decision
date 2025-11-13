const { caseValidationDocumentRows } = require('./case-validation-documents-details-rows');
const {
	APPEAL_DOCUMENT_TYPE,
	APPEAL_CASE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');
const { makeDocument } = require('./../questionnaire-details/test-factory');
const { formatRows } = require('@pins/common');
const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');

describe('caseValidationDocumentRows', () => {
	it('should return empty array when no additional documents uploaded for appeal validation', () => {
		const caseData = { Documents: [makeDocument(APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP)] };
		expect(caseValidationDocumentRows({ caseData, userType: LPA_USER_ROLE })).toEqual([]);
		expect(caseValidationDocumentRows({ caseData, userType: APPEAL_USER_ROLES.APPELLANT })).toEqual(
			[]
		);
	});

	it('should return a single row if an APPELLANT_CASE_CORRESPONDENCE document exists and outcome exists (LPA user)', () => {
		const doc = makeDocument(APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE);
		const caseData = {
			Documents: [doc],
			caseValidationOutcome: APPEAL_CASE_VALIDATION_OUTCOME.VALID
		};
		const rows = caseValidationDocumentRows({ caseData, userType: LPA_USER_ROLE });
		expect(formatRows(rows, caseData)).toHaveLength(1);
		expect(rows).toHaveLength(1);
		expect(rows[0].keyText).toBe('');
		expect(rows[0].valueText).toContain('name.pdf');
		expect(typeof rows[0].condition).toBe('function');
		expect(rows[0].condition(caseData)).toBe(true);
		const unvalidatedCase = {
			...caseData,
			caseValidationOutcome: null
		};
		expect(rows[0].condition(unvalidatedCase)).toBe(false);
	});

	it('should return a single row if an APPELLANT_CASE_CORRESPONDENCE document exists and outcome exists (Appellant user)', () => {
		const doc = makeDocument(APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE);
		const caseData = {
			Documents: [doc],
			caseValidationOutcome: APPEAL_CASE_VALIDATION_OUTCOME.INVALID
		};
		const rows = caseValidationDocumentRows({ caseData, userType: APPEAL_USER_ROLES.APPELLANT });
		expect(formatRows(rows, caseData)).toHaveLength(1);
		expect(rows).toHaveLength(1);
		expect(rows[0].keyText).toBe('');
		expect(rows[0].valueText).toContain('name.pdf');
		expect(typeof rows[0].condition).toBe('function');
		expect(rows[0].condition(caseData)).toBe(true);
		const unvalidatedCase = {
			...caseData,
			caseValidationOutcome: null
		};
		expect(rows[0].condition(unvalidatedCase)).toBe(false);
	});

	it('should return a bulleted list if multiple APPELLANT_CASE_CORRESPONDENCE documents exist and outcome exists', () => {
		const doc1 = makeDocument(APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE);
		const doc2 = makeDocument(APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE);
		const caseData = {
			Documents: [doc1, doc2],
			caseValidationOutcome: APPEAL_CASE_VALIDATION_OUTCOME.VALID
		};
		const rows = caseValidationDocumentRows({ caseData, userType: APPEAL_USER_ROLES.APPELLANT });
		expect(formatRows(rows, caseData)).toHaveLength(1);
		expect(rows).toHaveLength(1);
		expect(rows[0].keyText).toBe('');
		expect(rows[0].valueText).toContain('<ul>');
		expect(rows[0].valueText).toContain('name.pdf');
		expect(typeof rows[0].condition).toBe('function');
		expect(rows[0].condition(caseData)).toBe(true);
		const unvalidatedCase = {
			...caseData,
			caseValidationOutcome: null
		};
		expect(rows[0].condition(unvalidatedCase)).toBe(false);
	});

	it('should return empty array if APPELLANT_CASE_CORRESPONDENCE exists but the outcome does not', () => {
		const doc = makeDocument(APPEAL_DOCUMENT_TYPE.APPELLANT_CASE_CORRESPONDENCE);
		const caseData = {
			Documents: [doc],
			caseValidationOutcome: null
		};
		const rows = caseValidationDocumentRows({ caseData, userType: LPA_USER_ROLE });
		expect(formatRows(rows, caseData)).toEqual([]);
	});

	it('should handle missing Documents array gracefully', () => {
		const caseData = {};
		expect(caseValidationDocumentRows({ caseData, userType: LPA_USER_ROLE })).toEqual([]);
	});
});
