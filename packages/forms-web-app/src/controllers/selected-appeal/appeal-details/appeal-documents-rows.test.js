const { documentsRows } = require('./appeal-documents-rows');
const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('appeal-documents-rows', () => {
	it('should create rows', () => {
		const rows = documentsRows({ Documents: [] });
		expect(rows.length).toEqual(14);
	});

	it('should show a document', () => {
		const rows = documentsRows({
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.ORIGINAL_APPLICATION_FORM,
					filename: 'test.txt',
					redacted: true
				}
			]
		});

		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].isEscaped).toEqual(true);
		expect(rows[0].keyText).toEqual('Application form');
		expect(rows[0].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});

	describe('Plans, drawings and supporting documents', () => {
		it('should display field if S78', () => {
			const rows = documentsRows({ appealTypeCode: APPEALS_CASE_DATA.APPEAL_TYPE_CODE.S78 });
			expect(rows[2].keyText).toEqual('Plans, drawings and supporting documents');
			expect(rows[2].valueText).toEqual('No');
			expect(rows[2].condition()).toEqual(true);
			expect(rows[2].isEscaped).toEqual(true);
		});
		it('should not display field if not S78', () => {
			const rows = documentsRows({ appealTypeCode: APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS });
			expect(rows[2].keyText).toEqual('Plans, drawings and supporting documents');
			expect(rows[2].valueText).toEqual('No');
			expect(rows[2].condition()).toEqual(false);
			expect(rows[2].isEscaped).toEqual(true);
		});
	});
});
