const {
	documentExists,
	hasNotificationMethods,
	formatNotificationMethod
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
});
