const { consultationRows } = require('./consultation-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

describe('consultationRows', () => {
	it('should create rows', () => {
		const rows = consultationRows(
			{ statutoryConsultees: true, consultationResponses: true },
			APPEAL_USER_ROLES.AGENT
		);
		expect(rows.length).toEqual(5);
		expect(rows[0].valueText).toEqual('Yes');
		expect(rows[1].valueText).toEqual('Yes');
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
