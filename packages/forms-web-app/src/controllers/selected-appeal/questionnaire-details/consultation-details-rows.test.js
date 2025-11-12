const { consultationRows } = require('./consultation-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const { caseTypeLPAQFactory } = require('./test-factory');

describe('consultationRows', () => {
	const hasLPAQData = caseTypeLPAQFactory(CASE_TYPES.HAS.processCode, 'consultation');
	const casPlanningLPAQData = caseTypeLPAQFactory(
		CASE_TYPES.CAS_PLANNING.processCode,
		'consultation'
	);
	const casAdvertLPAQData = caseTypeLPAQFactory(CASE_TYPES.CAS_ADVERTS.processCode, 'consultation');
	const s78LPAQData = caseTypeLPAQFactory(CASE_TYPES.S78.processCode, 'consultation');
	const s20LPAQData = caseTypeLPAQFactory(CASE_TYPES.S20.processCode, 'consultation');
	const advertLPAQData = caseTypeLPAQFactory(CASE_TYPES.ADVERTS.processCode, 'consultation');

	const expectedRowsHas = [
		{ title: 'Representations from other parties', value: 'Yes' },
		{
			title: 'Uploaded representations from other parties',
			value: 'name.pdf - awaiting review'
		}
	];

	const expectedRowsS78 = [
		{
			title: 'Statutory consultees',
			value: 'Yes\nConsulted bodies details here'
		},
		{ title: 'Responses or standing advice', value: 'Yes' },
		{
			title: 'Uploaded consultation responses and standing advice',
			value: 'name.pdf - awaiting review'
		},
		{ title: 'Representations from other parties', value: 'Yes' },
		{
			title: 'Uploaded representations from other parties',
			value: 'name.pdf - awaiting review'
		}
	];

	const expectedRowsAdverts = [
		{
			title: 'Statutory consultees',
			value: 'Yes\nConsulted bodies details here'
		},
		{ title: 'Representations from other parties', value: 'Yes' },
		{
			title: 'Uploaded representations from other parties',
			value: 'name.pdf - awaiting review'
		}
	];

	it.each([
		['HAS', hasLPAQData, expectedRowsHas],
		['CAS Planning', casPlanningLPAQData, expectedRowsHas],
		['CAS Adverts', casAdvertLPAQData, expectedRowsHas],
		['ADVERTS', advertLPAQData, expectedRowsAdverts],
		['S78', s78LPAQData, expectedRowsS78],
		['S20', s20LPAQData, expectedRowsS78]
	])(`should create correct rows for appeal type %s`, (_, caseData, expectedRows) => {
		const visibleRows = consultationRows(caseData)
			.filter((row) => row.condition(caseData))
			.map((visibleRow) => {
				return { title: visibleRow.keyText, value: visibleRow.valueText };
			});
		expect(visibleRows).toEqual(expectedRows);
	});

	it('should show a document', () => {
		const rows = consultationRows({
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.CONSULTATION_RESPONSES,
					filename: 'test.txt',
					redacted: true
				}
			]
		});

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].isEscaped).toEqual(true);
		expect(rows[2].keyText).toEqual('Uploaded consultation responses and standing advice');
		expect(rows[2].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});

	describe('Other Party Representations', () => {
		it('returns correct values when document exists', () => {
			const caseData = {
				Documents: [
					{
						id: 1,
						documentType: APPEAL_DOCUMENT_TYPE.OTHER_PARTY_REPRESENTATIONS,
						filename: 'testing',
						redacted: true
					}
				]
			};

			const rows = consultationRows(caseData);

			expect(rows[3].keyText).toEqual('Representations from other parties');
			expect(rows[3].valueText).toEqual('Yes');
			expect(rows[3].condition()).toEqual(true);
			expect(rows[3].isEscaped).toEqual(true);

			expect(rows[4].keyText).toEqual('Uploaded representations from other parties');
			expect(rows[4].valueText).toEqual(
				'<a href="/published-document/1" class="govuk-link">testing</a>'
			);
			expect(rows[4].condition()).toEqual(true);
			expect(rows[4].isEscaped).toEqual(true);
		});

		it('returns correct values when document does not exist', () => {
			const caseData = {
				Documents: []
			};

			const rows = consultationRows(caseData);

			expect(rows[3].keyText).toEqual('Representations from other parties');
			expect(rows[3].valueText).toEqual('No');
			expect(rows[3].condition()).toEqual(true);

			expect(rows[4].keyText).toEqual('Uploaded representations from other parties');
			expect(rows[4].valueText).toEqual('No');
			expect(rows[4].condition()).toEqual(false);
		});
	});
});
