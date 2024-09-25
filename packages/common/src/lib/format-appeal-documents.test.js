const {
	documentExists,
	hasNotificationMethods,
	formatNotificationMethod,
	sortDocumentsByDate
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
