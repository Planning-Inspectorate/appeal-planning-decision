const { constraintsRows } = require('./constraints-details-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

describe('constraintsRows', () => {
	it('should create rows', () => {
		const rows = constraintsRows({}, APPEAL_USER_ROLES.AGENT);
		expect(rows.length).toEqual(14);
	});

	it('should show a document', () => {
		const rows = constraintsRows({
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.CONSERVATION_MAP,
					filename: 'test.txt',
					redacted: true
				}
			]
		});

		expect(rows[4].condition()).toEqual(true);
		expect(rows[4].isEscaped).toEqual(true);
		expect(rows[4].keyText).toEqual('Uploaded conservation area map and guidance');
		expect(rows[4].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});
});
