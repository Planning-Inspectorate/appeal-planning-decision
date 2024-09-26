const { appealSubmissionRows } = require('./ip-appeal-submission-rows');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

describe('appealSubmissionRows', () => {
	it('should create rows', () => {
		const rows = appealSubmissionRows({});
		expect(rows.length).toEqual(5);
	});

	it('should show a document', () => {
		const rows = appealSubmissionRows({
			Documents: [
				{
					id: 1,
					documentType: APPEAL_DOCUMENT_TYPE.STATEMENT_COMMON_GROUND,
					filename: 'test.txt'
				}
			]
		});

		expect(rows[0].condition()).toEqual(true);
		expect(rows[0].isEscaped).toEqual(true);
		expect(rows[0].keyText).toEqual('Draft statement of common ground');
		expect(rows[0].valueText).toEqual(
			'<a href="/published-document/1" class="govuk-link">test.txt</a>'
		);
	});
});
