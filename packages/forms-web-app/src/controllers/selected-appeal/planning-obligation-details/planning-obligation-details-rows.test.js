const { planningObligationRows } = require('./planning-obligation-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('planningObligationRows', () => {
	it('should create show minimal rows', () => {
		const rows = planningObligationRows({});
		expect(rows.length).toEqual(3);
		expect(rows[0].condition()).toEqual(false);
		expect(rows[1].condition()).toEqual(false);
		expect(rows[2].condition()).toEqual(false);
	});

	it('should show obligation rows S78 rows', () => {
		const rows = planningObligationRows({
			statusPlanningObligation: 'finalised',
			Documents: [{ documentType: APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION, filename: 'test' }]
		});
		expect(rows.length).toEqual(3);
		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].valueText).toEqual('Yes');

		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].valueText).toEqual('finalised');

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].valueText).toEqual('test - awaiting review');
	});

	it('should show a document', () => {
		const rows = planningObligationRows({
			statusPlanningObligation: 'finalised',
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION,
					filename: 'test.txt',
					redacted: true
				}
			]
		});

		expect(rows[2].condition()).toEqual(true);
		expect(rows[2].isEscaped).toEqual(true);
		expect(rows[2].keyText).toEqual('Planning obligation');
		expect(rows[2].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});
});
