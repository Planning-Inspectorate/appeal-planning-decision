const {
	documentExists,
	hasNotificationMethods,
	formatNotificationMethod,
	sortDocumentsByDate,
	formatDocumentDetails
} = require('./format-appeal-documents');
const { LPA_NOTIFICATION_METHODS } = require('../database/data-static');

describe('format-case-type:', () => {
	describe('documentExists', () => {
		const testDocType = 'a-doc';
		it('returns false for falsy values', () => {
			expect(documentExists(null, testDocType)).toEqual(false);
			expect(documentExists(undefined, testDocType)).toEqual(false);
			expect(documentExists([], testDocType)).toEqual(false);
		});

		it('returns true for a populated array', () => {
			expect(
				documentExists(
					[
						{
							documentType: testDocType
						},
						{
							documentType: testDocType
						}
					],
					testDocType
				)
			).toEqual(true);
		});
	});

	describe('hasNotificationMethods', () => {
		it('returns false for falsy values', () => {
			expect(hasNotificationMethods({ AppealCaseLpaNotificationMethod: null })).toEqual(false);
			expect(hasNotificationMethods({ AppealCaseLpaNotificationMethod: undefined })).toEqual(false);
			expect(hasNotificationMethods({ AppealCaseLpaNotificationMethod: [] })).toEqual(false);
		});

		it('returns true for a populated array', () => {
			expect(hasNotificationMethods({ AppealCaseLpaNotificationMethod: [1] })).toEqual(true);
		});
	});

	describe('formatNotificationMethod', () => {
		it('returns empty string for falsy', () => {
			expect(formatNotificationMethod({ AppealCaseLpaNotificationMethod: null })).toEqual('');
			expect(formatNotificationMethod({ AppealCaseLpaNotificationMethod: undefined })).toEqual('');
			expect(formatNotificationMethod({ AppealCaseLpaNotificationMethod: [] })).toEqual('');
		});

		it('returns nothing for unknown method', () => {
			expect(formatNotificationMethod({ AppealCaseLpaNotificationMethod: ['abc'] })).toEqual('');
		});

		it('returns new line separated list of valid answers', () => {
			expect(
				formatNotificationMethod({
					AppealCaseLpaNotificationMethod: [
						{ lPANotificationMethodsKey: LPA_NOTIFICATION_METHODS.notice.key },
						{ lPANotificationMethodsKey: LPA_NOTIFICATION_METHODS.letter.key }
					]
				})
			).toEqual('A site notice\nLetter/email to interested parties');
		});
	});

	describe('formatDocumentLink', () => {
		it('returns "No" for no documents', () => {
			expect(formatDocumentDetails([], '')).toEqual('No');
			expect(formatDocumentDetails([{ documentType: 'a' }], 'b')).toEqual('No');
		});

		it('returns escaped links for document, or awaiting review for unredacted docs', () => {
			const doc1 = { documentType: 'a', id: '1', filename: 'test>1', redacted: true };
			const doc2 = { documentType: 'a', id: '2', filename: 'test>2', redacted: false };
			expect(formatDocumentDetails([doc1, doc2], 'a')).toEqual(
				'<a href="/published-document/1" class="govuk-link">test&gt;1</a>\ntest&gt;2 - awaiting review'
			);
		});
	});

	describe('sortDocumentsByDate', () => {
		it('should sort documents by datePublished in ascending order', () => {
			const documents = [
				{ title: 'Doc 1', datePublished: '2023-09-11' },
				{ title: 'Doc 2', datePublished: '2023-09-13' },
				{ title: 'Doc 3', datePublished: '2023-09-10' }
			];
			const sortedDocs = sortDocumentsByDate(documents);

			expect(sortedDocs).toEqual([
				{ title: 'Doc 3', datePublished: '2023-09-10' },
				{ title: 'Doc 1', datePublished: '2023-09-11' },
				{ title: 'Doc 2', datePublished: '2023-09-13' }
			]);
		});
		it('should return an empty array when no documents are provided', () => {
			const documents = [];
			const sortedDocs = sortDocumentsByDate(documents);
			expect(sortedDocs).toEqual([]);
		});
		it('should return the same document if only one document is provided', () => {
			const documents = [{ title: 'Doc 1', datePublished: '2023-09-11' }];
			const sortedDocs = sortDocumentsByDate(documents);
			expect(sortedDocs).toEqual([{ title: 'Doc 1', datePublished: '2023-09-11' }]);
		});
	});
});
