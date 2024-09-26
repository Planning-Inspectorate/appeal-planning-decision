const { applicationRows } = require('./ip-application-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('applicationRows', () => {
	it('should create rows', () => {
		const rows = applicationRows({});
		expect(rows.length).toEqual(5);
	});

	it('should show a document', () => {
		const rows = applicationRows({
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.APPLICATION_DECISION_LETTER,
					filename: 'test.txt'
				}
			]
		});

		expect(rows[1].condition()).toEqual(true);
		expect(rows[1].isEscaped).toEqual(true);
		expect(rows[1].keyText).toEqual('Application decision notice');
		expect(rows[1].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});
});
