const { planningObligationRows } = require('./planning-obligation-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');
describe('planningObligationRows', () => {
	it('should create rows', () => {
		const rows = planningObligationRows({});
		expect(rows.length).toEqual(2);
	});

	it('should show a document', () => {
		const rows = planningObligationRows({
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION,
					filename: 'test.txt',
					redacted: true
				}
			]
		});

		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].isEscaped).toEqual(true);
		expect(rows[1].keyText).toEqual('Planning obligation');
		expect(rows[1].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});
});
