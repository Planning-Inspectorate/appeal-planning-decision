const { consultationRows } = require('./consultation-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

describe('consultationRows', () => {
	it('should create HAS rows', () => {
		const rows = consultationRows(
			{ appealTypeCode: CASE_TYPES.HAS.processCode },
			APPEAL_USER_ROLES.AGENT
		);
		expect(rows.length).toEqual(5);
		expect(rows[0].valueText).toEqual('No');
		expect(rows[0].condition()).toEqual(false);
		expect(rows[1].valueText).toEqual('No');
		expect(rows[1].condition()).toEqual(false);
		expect(rows[2].valueText).toEqual('No');
		expect(rows[2].condition()).toEqual(false);
	});

	it('should create S78 rows', () => {
		const rows = consultationRows(
			{
				appealTypeCode: CASE_TYPES.S78.processCode,
				statutoryConsultees: true,
				consultedBodiesDetails: 'testing 123',
				Documents: [{ documentType: APPEAL_DOCUMENT_TYPE.CONSULTATION_RESPONSES, filename: 'test' }]
			},
			APPEAL_USER_ROLES.AGENT
		);
		expect(rows.length).toEqual(5);
		expect(rows[0].valueText).toEqual('Yes\ntesting 123');
		expect(rows[0].condition()).toEqual(true);
		expect(rows[1].valueText).toEqual('Yes');
		expect(rows[1].condition()).toEqual(true);
		expect(rows[2].valueText).toEqual('test - awaiting review');
		expect(rows[2].condition()).toEqual(true);
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
