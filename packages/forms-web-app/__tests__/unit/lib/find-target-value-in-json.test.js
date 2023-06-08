const { findTargetValueInJSON } = require('../../../src/lib/find-target-value-in-json');
const appeal = require('../../mockData/full-appeal');
const finalComment = {
	supportingDocuments: { uploadedFile: 'file.jpg' }
};

describe('lib/find-target-value-in-json', () => {
	it('finds a value in a JSON object when provided with a target key', () => {
		expect(findTargetValueInJSON(appeal, 'ownershipCertificate')).toEqual(
			appeal.planningApplicationDocumentsSection.ownershipCertificate
		);
		expect(findTargetValueInJSON(appeal, 'appealPDFStatement')).toEqual(
			appeal.appealSubmission.appealPDFStatement
		);
		expect(findTargetValueInJSON(finalComment, 'supportingDocuments')).toEqual(
			finalComment.supportingDocuments
		);
	});

	it('returns undefined if target key is not in JSON object', () => {
		expect(findTargetValueInJSON(appeal, 'iDoNotExist')).toEqual(undefined);
		expect(findTargetValueInJSON(finalComment, 'otherDocuments')).toEqual(undefined);
	});

	it('ignores specified key', () => {
		const testObject = {
			ignoreThis: { findMe: 'not the correct answer' },
			alsoIgnore: { ignoreThis: { findMe: 'also not correct' } },
			anotherIgnore: { fieldName: { ignoreThis: { findMe: 'do not return this' } } },
			findThis: { findMe: 'this is correct' }
		};

		expect(findTargetValueInJSON(testObject, 'findMe', 'ignoreThis')).toEqual(
			testObject.findThis.findMe
		);
	});
});
