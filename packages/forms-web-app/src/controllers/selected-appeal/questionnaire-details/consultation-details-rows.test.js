const { consultationRows } = require('./consultation-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

describe('consultationRows', () => {
	it('should create rows', () => {
		const rows = consultationRows({}, APPEAL_USER_ROLES.AGENT);
		expect(rows.length).toEqual(5);
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
});
