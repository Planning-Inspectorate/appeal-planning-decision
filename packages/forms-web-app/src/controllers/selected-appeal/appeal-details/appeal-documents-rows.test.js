const { documentsRows } = require('./appeal-documents-rows');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const {
	APPEAL_DOCUMENT_TYPE,
	APPEAL_APPELLANT_PROCEDURE_PREFERENCE
} = require('@planning-inspectorate/data-model');

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

	const allAppealTypes = Object.values(CASE_TYPES).map((caseType) => caseType.processCode);

	// displayed for all appeal types
	describe.each([
		['Application form', 0],
		['Decision letter', 4],
		['Appeal statement', 5]
	])('%s', (rowName, rowNumber) => {
		test.each(allAppealTypes)('should display field for %s', (processCode) => {
			const rows = documentsRows({ appealTypeCode: processCode });
			expect(rows[rowNumber].keyText).toEqual(rowName);
			expect(rows[rowNumber].valueText).toEqual('No');
			expect(rows[rowNumber].condition()).toEqual(true);
			expect(rows[rowNumber].isEscaped).toEqual(true);
		});
	});

	// depends on the appeal type
	describe.each([
		[
			'Plans, drawings and supporting documents',
			1,
			[
				CASE_TYPES.S78.processCode,
				CASE_TYPES.S20.processCode,
				CASE_TYPES.CAS_PLANNING.processCode,
				CASE_TYPES.ADVERTS.processCode,
				CASE_TYPES.CAS_ADVERTS.processCode,
				CASE_TYPES.ENFORCEMENT.processCode,
				CASE_TYPES.ENFORCEMENT_LISTED.processCode,
				CASE_TYPES.LDC.processCode
			]
		],
		[
			'Separate ownership certificate in application',
			2,
			[CASE_TYPES.S78.processCode, CASE_TYPES.S20.processCode]
		],
		[
			'Design and access statement in application',
			3,
			[CASE_TYPES.S78.processCode, CASE_TYPES.S20.processCode, CASE_TYPES.CAS_PLANNING.processCode]
		],
		['New plans or drawings', 6, [CASE_TYPES.S78.processCode, CASE_TYPES.S20.processCode]],
		['Planning obligation', 8, [CASE_TYPES.S78.processCode, CASE_TYPES.S20.processCode]],
		['New supporting documents', 9, [CASE_TYPES.S78.processCode, CASE_TYPES.S20.processCode]]
	])('%s', (rowName, rowNumber, expectedAppealTypes) => {
		allAppealTypes
			.filter((x) => !expectedAppealTypes.includes(x))
			.forEach((processCode) => {
				it(`should not display field if ${processCode}`, () => {
					const rows = documentsRows({ appealTypeCode: processCode });
					expect(rows[rowNumber].keyText).toEqual(rowName);
					expect(rows[rowNumber].valueText).toEqual('No');
					expect(rows[rowNumber].condition()).toEqual(false);
					expect(rows[rowNumber].isEscaped).toEqual(true);
				});
			});

		test.each(expectedAppealTypes)('should display field if %s', (processCode) => {
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

	// text varies based on appeal type
	describe('Evidence of agreement to change description', () => {
		const evidenceRow = 11;
		test.each([
			['HAS', CASE_TYPES.S78.processCode],
			['S78', CASE_TYPES.S78.processCode],
			['S20', CASE_TYPES.S20.processCode],
			['CAS_PLANNING', CASE_TYPES.CAS_PLANNING.processCode]
		])('should display field if %s', (_, processCode) => {
			const caseData = { appealTypeCode: processCode, changedDevelopmentDescription: true };
			const rows = documentsRows(caseData);
			expect(rows[evidenceRow].keyText).toEqual(
				'Evidence of agreement to change description of development'
			);
			expect(rows[evidenceRow].valueText).toEqual('No');
			expect(rows[evidenceRow].condition(caseData)).toEqual(true);
			expect(rows[evidenceRow].isEscaped).toEqual(true);
		});

		test.each([
			['ADVERTS', CASE_TYPES.ADVERTS.processCode],
			['CAS_ADVERTS', CASE_TYPES.CAS_ADVERTS.processCode]
		])('should display advert text for advert appeals', (_, processCode) => {
			const caseData = {
				appealTypeCode: processCode,
				changedDevelopmentDescription: true
			};
			const rows = documentsRows(caseData);
			expect(rows[evidenceRow].keyText).toEqual(
				'Upload the evidence of your agreement to change the description of the advertisement'
			);
			expect(rows[evidenceRow].valueText).toEqual('No');
			expect(rows[evidenceRow].condition(caseData)).toEqual(true);
			expect(rows[evidenceRow].isEscaped).toEqual(true);
		});
	});
});
