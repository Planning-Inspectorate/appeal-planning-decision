const { documentsRows } = require('./appeal-documents-rows');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('appeal-documents-rows', () => {
	it('should create rows', () => {
		const rows = documentsRows({ Documents: [] }, APPEAL_USER_ROLES.APPELLANT);
		expect(rows.length).toEqual(14);
	});

	it('should show a document', () => {
		const rows = documentsRows(
			{
				Documents: [
					{
						id: 1,
						documentType: APPEAL_DOCUMENT_TYPE.ORIGINAL_APPLICATION_FORM,
						filename: 'test.txt'
					}
				]
			},
			APPEAL_USER_ROLES.AGENT
		);

		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].isEscaped).toEqual(true);
		expect(rows[0].keyText).toEqual('Application form');
		expect(rows[0].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});
});
