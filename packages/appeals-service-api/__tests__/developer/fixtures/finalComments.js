const uuid = require('uuid');

module.exports = class FinalCommentFixtures {
	static newFinalComment({
		horizonId = '1234567',
		state = 'DRAFT',
		lpaCode = 'E69999999',
		email = 'test@example.com',
		name = 'John Smith',
		finalCommentExpiryDate = '2023-05-01T09:00:00',
		typeOfUser = 'Appellant'
	} = {}) {
		return {
			id: uuid.v4(),
			horizonId: horizonId,
			state: state,
			lpaCode: lpaCode,
			email: email,
			name: name,
			finalCommentExpiryDate: finalCommentExpiryDate,
			finalCommentSubmissionDate: null,
			secureCodeEnteredCorrectly: false,
			hasComment: false,
			doesNotContainSensitiveInformation: true,
			finalComment: 'Something interesting to say',
			finalCommentAsDocument: {
				uploadedFile: {
					name: 'thefile.pdf',
					id: null
				}
			},
			hasSupportingDocuments: false,
			typeOfUser: typeOfUser,
			supportingDocuments: {
				uploadedFiles: []
			}
		};
	}
};
