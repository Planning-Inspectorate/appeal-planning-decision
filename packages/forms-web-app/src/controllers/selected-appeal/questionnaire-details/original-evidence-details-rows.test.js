const { originalEvidenceRows } = require('./original-evidence-details-rows');
const {
	APPEAL_DOCUMENT_TYPE,
	APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME
} = require('@planning-inspectorate/data-model');
const { makeDocument } = require('./test-factory');

describe('Original Evidence', () => {
	it('should return all rows when documents exist', () => {
		const docDesignAccessStatement = makeDocument(APPEAL_DOCUMENT_TYPE.DESIGN_ACCESS_STATEMENT_LPA);
		const docPlansAndDrawings = makeDocument(APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS_LPA);
		const docAdditionalDocuments = makeDocument(APPEAL_DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS_LPA);
		const caseData = {
			Documents: [docDesignAccessStatement, docPlansAndDrawings, docAdditionalDocuments],
			lpaQuestionnaireValidationOutcome: APPEAL_LPA_QUESTIONNAIRE_VALIDATION_OUTCOME.COMPLETE,
			eligibility: { applicationDecision: 'granted' },
			typeOfPlanningApplication: 'full-appeal',
			applicationDate: '2026-04-01',
			listOfDocumentsBeforeDecision: 'Document 1, Document 2, Document 3'
		};
		const rows = originalEvidenceRows({ caseData });
		expect(rows).toHaveLength(4);
		expect(rows[0].keyText).toBe('Design and access statement');
		expect(rows[0].valueText).toContain('name.pdf');
		expect(rows[1].keyText).toBe('Plans and drawings');
		expect(rows[1].valueText).toContain('name.pdf');
		expect(rows[2].keyText).toBe('Any other documents submitted with the application');
		expect(rows[2].valueText).toContain('name.pdf');
		expect(rows[3].keyText).toBe('What documents and plans did you use to make your decision?');
		expect(rows[3].valueText).toBe('Document 1, Document 2, Document 3');
	});

	it('should handle missing Documents array gracefully', () => {
		const caseData = {
			listOfDocumentsBeforeDecision: 'Document 1, Document 2, Document 3'
		};
		const visibleRows = originalEvidenceRows({
			caseData
		}).map((visibleRow) => {
			return { title: visibleRow.keyText, value: visibleRow.valueText };
		});
		expect(visibleRows).toEqual([
			{ title: 'Design and access statement', value: 'No' },
			{ title: 'Plans and drawings', value: 'No' },
			{ title: 'Any other documents submitted with the application', value: 'No' },
			{
				title: 'What documents and plans did you use to make your decision?',
				value: 'Document 1, Document 2, Document 3'
			}
		]);
	});
});
