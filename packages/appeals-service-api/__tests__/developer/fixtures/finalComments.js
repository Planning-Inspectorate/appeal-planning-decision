module.exports = class FinalCommentFixtures {
	static newFinalComment({
		horizonId = '1234567',
		state = 'DRAFT',
		email = 'test@pins.com',
		finalCommentExpiryDate = '2023-05-01T09:00:00',
		typeOfUser = 'Appellant'
	} = {}) {
		return {
			horizonId: horizonId,
			state: state,
			email: email,
			finalCommentExpiryDate: finalCommentExpiryDate,
			finalCommentSubmissionDate: null,
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
