const { environmentalRows } = require('./environmental-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('environmentalRows', () => {
	it('should create rows', () => {
		const rows = environmentalRows({});
		expect(rows.length).toEqual(10);
	});

	it('should show a document', () => {
		const rows = environmentalRows({
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.EIA_SCREENING_OPINION,
					filename: 'test.txt',
					redacted: true
				}
			]
		});

		expect(rows[5].condition()).toEqual(true);
		expect(rows[5].isEscaped).toEqual(true);
		expect(rows[5].keyText).toEqual('Uploaded screening opinion');
		expect(rows[5].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});
});
