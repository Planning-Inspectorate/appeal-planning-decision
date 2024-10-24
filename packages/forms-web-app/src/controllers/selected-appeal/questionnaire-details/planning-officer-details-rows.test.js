const { planningOfficerReportRows } = require('./planning-officer-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('planningOfficerReportRows', () => {
	it('should create rows', () => {
		const rows = planningOfficerReportRows({});
		expect(rows.length).toEqual(12);
	});

	it('should show documents', () => {
		const rows = planningOfficerReportRows({
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.PLANNING_OFFICER_REPORT,
					filename: 'test.txt',
					redacted: true
				},
				{
					id: 2,
					documentType: APPEAL_DOCUMENT_TYPE.DEVELOPMENT_PLAN_POLICIES,
					filename: 'test2.txt',
					redacted: true
				}
			]
		});

		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].isEscaped).toEqual(true);
		expect(rows[0].keyText).toEqual("Uploaded planning officer's report");
		expect(rows[0].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].isEscaped).toEqual(true);
		expect(rows[1].keyText).toEqual('Uploaded policies from statutory development plan');
		expect(rows[1].valueText).toEqual(
			'<a href="/published-document/2" class="govuk-link">test2.txt</a>'
		);
	});
});
