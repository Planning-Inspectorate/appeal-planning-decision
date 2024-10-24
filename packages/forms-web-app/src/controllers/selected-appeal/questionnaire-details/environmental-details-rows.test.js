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
					documentType: APPEAL_DOCUMENT_TYPE.EIA_SCREENING_DIRECTION,
					filename: 'test.txt',
					redacted: true
				}
			]
		});

		expect(rows[4].condition()).toEqual(true);
		expect(rows[4].isEscaped).toEqual(true);
		expect(rows[4].keyText).toEqual('Uploaded screening direction');
		expect(rows[4].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});
});
