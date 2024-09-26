const { planningOfficerReportRows } = require('./planning-officer-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('planningOfficerReportRows', () => {
	it('should create rows', () => {
		const rows = planningOfficerReportRows({});
		expect(rows.length).toEqual(12);
	});

	it('should show a document', () => {
		const rows = planningOfficerReportRows({
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.PLANNING_OFFICER_REPORT,
					filename: 'test.txt'
				}
			]
		});

		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].isEscaped).toEqual(true);
		expect(rows[0].keyText).toEqual('Uploaded planning officer’s report');
		expect(rows[0].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});
});
