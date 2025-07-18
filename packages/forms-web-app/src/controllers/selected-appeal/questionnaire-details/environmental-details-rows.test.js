const { environmentalRows } = require('./environmental-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

describe('environmentalRows', () => {
	it('should create rows', () => {
		const rows = environmentalRows({});
		expect(rows.length).toEqual(12);

		expect(rows[0].keyText).toEqual('Schedule type');
		expect(rows[1].keyText).toEqual('Development description');
		expect(rows[2].keyText).toEqual('In, partly in, or likely to affect sensitive area');
		expect(rows[3].keyText).toEqual('Meets or exceeds threshold or criteria in column 2');
		expect(rows[4].keyText).toEqual('Issued screening opinion');
		expect(rows[5].keyText).toEqual('Uploaded screening opinion');
		expect(rows[6].keyText).toEqual('Received scoping opinion');
		expect(rows[7].keyText).toEqual('Uploaded scoping opinion');
		expect(rows[8].keyText).toEqual('Screening opinion indicated environmental statement needed');
		expect(rows[9].keyText).toEqual('Did Environmental statement');
		expect(rows[10].keyText).toEqual('Uploaded environmental statement');
		expect(rows[11].keyText).toEqual('Uploaded screening direction');
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

	it('should show a document', () => {
		const rows = environmentalRows({
			Documents: [
				{
					id: 2,
					documentType: APPEAL_DOCUMENT_TYPE.EIA_SCOPING_OPINION,
					filename: 'scoping_opinion.txt',
					redacted: true
				}
			]
		});

		expect(rows[7].condition()).toEqual(true);
		expect(rows[7].isEscaped).toEqual(true);
		expect(rows[7].keyText).toEqual('Uploaded scoping opinion');
		expect(rows[7].valueText).toEqual(
			'<a href="/published-document/2" class="govuk-link">scoping_opinion.txt</a>'
		);
	});
});
