const { additionalDocumentsRows } = require('./additional-documents-details-rows');
const {
	APPEAL_DOCUMENT_TYPE,
	APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');
const { makeDocument } = require('./test-factory');
const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');

describe('additionalDocumentsRows', () => {
	it('should not display if no LPA_CASE_CORRESPONDENCE documents for lpa', () => {
		const caseData = { Documents: [makeDocument(APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP)] };
		const visibleRows = additionalDocumentsRows({
			caseData,
			userType: LPA_USER_ROLE
		}).map((visibleRow) => {
			return { title: visibleRow.keyText, value: visibleRow.valueText };
		});
		expect(visibleRows).toEqual([{ title: 'Additional documents', value: 'No' }]);
	});

	it('should not display if no LPA_CASE_CORRESPONDENCE documents for appellant', () => {
		const caseData = { Documents: [makeDocument(APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP)] };
		const visibleRows = additionalDocumentsRows({
			caseData,
			userType: APPEAL_USER_ROLES.APPELLANT
		}).map((visibleRow) => {
			return { title: visibleRow.keyText, value: visibleRow.valueText };
		});
		expect(visibleRows).toEqual([{ title: 'Additional documents', value: 'No' }]);
	});

	it('should return a single row if an additional document exists and outcome is COMPLETE', () => {
		const doc = makeDocument(APPEAL_DOCUMENT_TYPE.LPA_CASE_CORRESPONDENCE);
		const caseData = {
			Documents: [doc],
			lpaQuestionnaireValidationOutcome: APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.COMPLETE
		};
		const rows = additionalDocumentsRows({ caseData, userType: LPA_USER_ROLE });
		expect(rows).toHaveLength(1);
		expect(rows[0].keyText).toBe('Additional documents');
		expect(rows[0].valueText).toContain('name.pdf');
		expect(typeof rows[0].condition).toBe('function');
		expect(rows[0].condition(caseData)).toBe(true);
		const incompleteCase = {
			...caseData,
			lpaQuestionnaireValidationOutcome: APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.INCOMPLETE
		};
		expect(rows[0].condition(incompleteCase)).toBe(false);
	});

	it('should return a numbered list if multiple additional documents exist and outcome is COMPLETE', () => {
		const doc1 = makeDocument(APPEAL_DOCUMENT_TYPE.LPA_CASE_CORRESPONDENCE);
		const doc2 = makeDocument(APPEAL_DOCUMENT_TYPE.LPA_CASE_CORRESPONDENCE);
		const caseData = {
			Documents: [doc1, doc2],
			lpaQuestionnaireValidationOutcome: APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.COMPLETE
		};
		const rows = additionalDocumentsRows({
			caseData: caseData,
			userType: APPEAL_USER_ROLES.APPELLANT
		});
		expect(rows).toHaveLength(1);
		expect(rows[0].keyText).toBe('Additional documents');
		expect(rows[0].valueText).toContain('<ol>');
		expect(rows[0].valueText).toContain('name.pdf');
		expect(typeof rows[0].condition).toBe('function');
		expect(rows[0].condition(caseData)).toBe(true);
		const incompleteCase = {
			...caseData,
			lpaQuestionnaireValidationOutcome: APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.INCOMPLETE
		};
		expect(rows[0].condition(incompleteCase)).toBe(false);
	});

	it('should handle missing Documents array gracefully', () => {
		const caseData = {};
		const visibleRows = additionalDocumentsRows({
			caseData,
			userType: LPA_USER_ROLE
		}).map((visibleRow) => {
			return { title: visibleRow.keyText, value: visibleRow.valueText };
		});
		expect(visibleRows).toEqual([{ title: 'Additional documents', value: 'No' }]);
	});
});
