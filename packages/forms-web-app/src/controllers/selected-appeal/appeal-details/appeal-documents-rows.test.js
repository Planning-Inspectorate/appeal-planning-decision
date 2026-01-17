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

	const allNonEnforcementAppealTypes = Object.values(CASE_TYPES)
		.map((caseType) => caseType.processCode)
		.filter(
			(processCode) =>
				!(
					processCode === CASE_TYPES.ENFORCEMENT.processCode ||
					processCode === CASE_TYPES.ENFORCEMENT_LISTED.processCode
				)
		);

	// displayed for all appeal types
	describe.each([
		['Application form', 0],
		['Decision letter', 4],
		['Appeal statement', 5]
	])('%s', (rowName, rowNumber) => {
		test.each(allNonEnforcementAppealTypes)('should display field for %s', (processCode) => {
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
		allNonEnforcementAppealTypes
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
			['CAS_PLANNING', CASE_TYPES.CAS_PLANNING.processCode],
			['LDC', CASE_TYPES.LDC.processCode]
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

describe('appeal-documents-rows - enforcement and enforcement listed', () => {
	it('should create rows for an enforcement appeal', () => {
		const rows = documentsRows({
			appealTypeCode: CASE_TYPES.ENFORCEMENT.processCode,
			Documents: []
		});
		expect(rows.length).toEqual(10);
	});

	const enforcementNoticeRow = 1;
	it('should show a document', () => {
		const rows = documentsRows({
			appealTypeCode: CASE_TYPES.ENFORCEMENT.processCode,
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.ENFORCEMENT_NOTICE,
					filename: 'test.txt',
					redacted: true
				}
			]
		});

		expect(rows[enforcementNoticeRow].condition()).toEqual(true);
		expect(rows[enforcementNoticeRow].isEscaped).toEqual(true);
		expect(rows[enforcementNoticeRow].keyText).toEqual('Enforcement notice');
		expect(rows[enforcementNoticeRow].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});

	const enforcementAppealTypes = [
		CASE_TYPES.ENFORCEMENT.processCode,
		CASE_TYPES.ENFORCEMENT_LISTED.processCode
	];

	// displayed for both enforcement appeal types
	describe.each([
		['Communication with Planning Inspectorate', 0],
		['Enforcement notice', 1],
		['Enforcement notice plan', 2],
		['Application form', 3],
		['Evidence of agreement to change description of development', 4],
		['Decision letter', 5],
		['Planning obligation', 7],
		['Costs application', 8],
		['New supporting documents', 9]
	])('%s', (rowName, rowNumber) => {
		test.each(enforcementAppealTypes)('should display field for %s', (processCode) => {
			const caseData = {
				appealTypeCode: processCode,
				applicationMadeAndFeePaid: true,
				contactPlanningInspectorateDate: '2025-02-01T08:00:00.000Z',
				changedDevelopmentDescription: true,
				appellantCostsAppliedFor: true
			};
			const rows = documentsRows(caseData);
			expect(rows[rowNumber].keyText).toEqual(rowName);
			expect(rows[rowNumber].valueText).toEqual('No');
			expect(rows[rowNumber].condition(caseData)).toEqual(true);
			expect(rows[rowNumber].isEscaped).toEqual(true);
		});
	});

	// depends on whether it is written or not
	describe('Planning obligation status', () => {
		const enforcementAppealTypes = [
			CASE_TYPES.ENFORCEMENT.processCode,
			CASE_TYPES.ENFORCEMENT_LISTED.processCode
		];

		test.each(enforcementAppealTypes)(
			'should display planning obligation status',
			(processCode) => {
				const caseData = {
					appealTypeCode: processCode,
					statusPlanningObligation: 'test status'
				};
				const rows = documentsRows(caseData);
				expect(rows[6].keyText).toEqual('Planning obligation status');
				expect(rows[6].valueText).toEqual(caseData.statusPlanningObligation);
				expect(rows[6].condition(caseData)).toEqual(true);
			}
		);
	});
});
