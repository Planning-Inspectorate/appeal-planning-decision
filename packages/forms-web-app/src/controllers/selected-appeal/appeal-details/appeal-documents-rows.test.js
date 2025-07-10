const { documentsRows } = require('./appeal-documents-rows');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const { APPEAL_DOCUMENT_TYPE, APPEAL_APPELLANT_PROCEDURE_PREFERENCE } = require('pins-data-model');

describe('appeal-documents-rows', () => {
	it('should create rows', () => {
		const rows = documentsRows({ Documents: [] });
		expect(rows.length).toEqual(13);
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

	// displayed for all appeal types
	describe.each([
		['Application form', 0],
		['Decision letter', 4],
		['Appeal statement', 5]
	])('%s', (rowName, rowNumber) => {
		test.each([
			['HAS', CASE_TYPES.HAS.processCode],
			['S78', CASE_TYPES.S78.processCode],
			['S20', CASE_TYPES.S20.processCode]
		])('should display field for %s', (_, processCode) => {
			const rows = documentsRows({ appealTypeCode: processCode });
			expect(rows[rowNumber].keyText).toEqual(rowName);
			expect(rows[rowNumber].valueText).toEqual('No');
			expect(rows[rowNumber].condition()).toEqual(true);
			expect(rows[rowNumber].isEscaped).toEqual(true);
		});
	});

	// depends on the appeal type
	describe.each([
		['Plans, drawings and supporting documents', 1],
		['Separate ownership certificate in application', 2],
		['Design and access statement in application', 3],
		['New plans or drawings', 6],
		['Planning obligation', 8],
		['New supporting documents', 9]
	])('%s', (rowName, rowNumber) => {
		it('should not display field if HAS', () => {
			const rows = documentsRows({ appealTypeCode: CASE_TYPES.HAS.processCode });
			expect(rows[rowNumber].keyText).toEqual(rowName);
			expect(rows[rowNumber].valueText).toEqual('No');
			expect(rows[rowNumber].condition()).toEqual(false);
			expect(rows[rowNumber].isEscaped).toEqual(true);
		});

		test.each([
			['S78', CASE_TYPES.S78.processCode],
			['S20', CASE_TYPES.S20.processCode]
		])('should display field if %s', (_, processCode) => {
			const rows = documentsRows({ appealTypeCode: processCode });
			expect(rows[rowNumber].keyText).toEqual(rowName);
			expect(rows[rowNumber].valueText).toEqual('No');
			expect(rows[rowNumber].condition()).toEqual(true);
			expect(rows[rowNumber].isEscaped).toEqual(true);
		});
	});

	// depends on the appeal type and whether it is written or not
	describe('Draft statement of common ground', () => {
		const draftRow = 10;
		test.each([
			['S78', CASE_TYPES.S78.processCode],
			['S20', CASE_TYPES.S20.processCode]
		])('should display field if %s and not written', (_, processCode) => {
			const rows = documentsRows({ appealTypeCode: processCode });
			expect(rows[draftRow].keyText).toEqual('Draft statement of common ground');
			expect(rows[draftRow].valueText).toEqual('No');
			expect(rows[draftRow].condition()).toEqual(true);
			expect(rows[draftRow].isEscaped).toEqual(true);
		});

		it('should not display field if HAS', () => {
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
