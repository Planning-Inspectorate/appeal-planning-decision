const { documentsRows } = require('./appeal-documents-rows');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const { APPEAL_DOCUMENT_TYPE, APPEAL_APPELLANT_PROCEDURE_PREFERENCE } = require('pins-data-model');

describe('appeal-documents-rows', () => {
	it('should create rows', () => {
		const rows = documentsRows({ Documents: [] });
		expect(rows.length).toEqual(14);
	});

	const applicationRow = 0;
	it('should show a document', () => {
		const rows = documentsRows({
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.ORIGINAL_APPLICATION_FORM,
					filename: 'test.txt',
					redacted: true
				}
			]
		});

		expect(rows[applicationRow].condition()).toEqual(true);
		expect(rows[applicationRow].isEscaped).toEqual(true);
		expect(rows[applicationRow].keyText).toEqual('Application form');
		expect(rows[applicationRow].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});

	describe('Plans, drawings and supporting documents', () => {
		const plansRow = 2;
		it('should display field if S78', () => {
			const rows = documentsRows({ appealTypeCode: CASE_TYPES.S78.processCode });
			expect(rows[plansRow].keyText).toEqual('Plans, drawings and supporting documents');
			expect(rows[plansRow].valueText).toEqual('No');
			expect(rows[plansRow].condition()).toEqual(true);
			expect(rows[plansRow].isEscaped).toEqual(true);
		});
		it('should not display field if not S78', () => {
			const rows = documentsRows({ appealTypeCode: CASE_TYPES.HAS.processCode });
			expect(rows[plansRow].keyText).toEqual('Plans, drawings and supporting documents');
			expect(rows[plansRow].valueText).toEqual('No');
			expect(rows[plansRow].condition()).toEqual(false);
			expect(rows[plansRow].isEscaped).toEqual(true);
		});
	});

	describe('Draft statement of common ground', () => {
		const draftRow = 11;
		it('should display field if S78 and not written', () => {
			const rows = documentsRows({ appealTypeCode: CASE_TYPES.S78.processCode });
			expect(rows[draftRow].keyText).toEqual('Draft statement of common ground');
			expect(rows[draftRow].valueText).toEqual('No');
			expect(rows[draftRow].condition()).toEqual(true);
			expect(rows[draftRow].isEscaped).toEqual(true);
		});
		it('should not display field if not S78', () => {
			const rows = documentsRows({ appealTypeCode: CASE_TYPES.HAS.processCode });
			expect(rows[draftRow].keyText).toEqual('Draft statement of common ground');
			expect(rows[draftRow].valueText).toEqual('No');
			expect(rows[draftRow].condition()).toEqual(false);
			expect(rows[draftRow].isEscaped).toEqual(true);
		});
		it('should not display field if Written', () => {
			const rows = documentsRows({
				appealTypeCode: CASE_TYPES.S78.processCode,
				appellantProcedurePreference: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.WRITTEN
			});
			expect(rows[draftRow].keyText).toEqual('Draft statement of common ground');
			expect(rows[draftRow].valueText).toEqual('No');
			expect(rows[draftRow].condition()).toEqual(false);
			expect(rows[draftRow].isEscaped).toEqual(true);
		});
	});
});
