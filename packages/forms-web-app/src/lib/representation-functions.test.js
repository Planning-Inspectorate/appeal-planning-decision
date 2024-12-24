const {
	filterRepresentationsBySubmittingParty,
	formatRepresentationHeading,
	formatRepresentations
} = require('./representation-functions');
const {
	LPA_USER_ROLE,
	REPRESENTATION_TYPES,
	APPEAL_USER_ROLES
} = require('@pins/common/src/constants');

const lpaStatement = {
	id: 'lpaStatement1',
	representationId: 'testStatement1',
	caseReference: 'testReference1',
	source: 'lpa',
	originalRepresentation: 'this is a rude statement',
	redacted: true,
	redactedRepresentation: 'this is a bleep statement',
	representationType: REPRESENTATION_TYPES.STATEMENT,
	dateReceived: '2024-11-25 09:00:00.0000000',
	RepresentationDocuments: []
};

const r6Statement = {
	id: 'r6Statement1',
	representationId: 'testStatement2',
	caseReference: 'testReference1',
	source: 'citizen',
	serviceUserId: 'testR6ServiceUserId',
	originalRepresentation: 'this is a statement',
	redacted: false,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	dateReceived: '2024-11-04 09:00:00.0000000',
	RepresentationDocuments: []
};

const lpaFinalComment = {
	id: 'lpaFinalComment1',
	representationId: 'testFinalComment1',
	caseReference: 'testReference1',
	source: 'lpa',
	originalRepresentation: 'this is a rude comment',
	redacted: true,
	redactedRepresentation: 'this is a bleep comment',
	representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
	dateReceived: '2024-11-25 09:00:00.0000000',
	RepresentationDocuments: []
};

const appellantFinalComment = {
	id: 'appellantFinalComment1',
	representationId: 'testFinalComment2',
	caseReference: 'testReference1',
	source: 'citizen',
	serviceUserId: 'testAppellantServiceUserId',
	originalRepresentation: 'this is a comment',
	redacted: false,
	representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
	dateReceived: '2024-11-04 09:00:00.0000000',
	RepresentationDocuments: []
};

const interestedPartyComment1 = {
	id: 'interestedPartyComment1',
	representationId: 'testInterestedPartyComment1',
	caseReference: 'testReference1',
	source: 'citizen',
	originalRepresentation: 'this is an interested party comment',
	redacted: false,
	representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
	dateReceived: '2024-11-04 09:00:00.0000000',
	RepresentationDocuments: []
};

const interestedPartyComment2 = {
	id: 'interestedPartyComment2',
	representationId: 'testInterestedPartyComment2',
	caseReference: 'testReference1',
	source: 'citizen',
	originalRepresentation: 'this is an earlier interested party comment',
	redacted: false,
	representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
	dateReceived: '2024-11-03 09:00:00.0000000',
	RepresentationDocuments: []
};

// const lpaProof1 = {
// 	id: 'lpaProof1',
// 	representationId: 'testLpaProof1',
// 	caseReference: 'testReference1',
// 	source: 'lpa',
// 	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
// 	dateReceived: '2024-11-25 09:00:00.0000000',
// 	RepresentationDocuments: []
// };

// const appellantProof1 = {
// 	id: 'apellantProof1',
// 	representationId: 'testAppellantProof1',
// 	caseReference: 'testReference1',
// 	source: 'citizen',
// 	serviceUserId: 'testAppellantServiceUserId',
// 	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
// 	dateReceived: '2024-11-25 09:00:00.0000000',
// 	RepresentationDocuments: []
// };

// const rule6Proof1 = {
// 	id: 'rule6Proof1',
// 	representationId: 'testrule6Proof1',
// 	caseReference: 'testReference1',
// 	source: 'citizen',
// 	serviceUserId: 'testR6ServiceUserId',
// 	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
// 	dateReceived: '2024-11-25 09:00:00.0000000',
// 	RepresentationDocuments: []
// }

const testStatements = [lpaStatement, r6Statement];

const testFinalComments = [lpaFinalComment, appellantFinalComment];

const testInterestedPartyComments = [interestedPartyComment1, interestedPartyComment2];

// const testProofsOfEvidence = [lpaProof1, appellantProof1, rule6Proof1];

const testUsers = [{ id: 'testAppellantServiceUserId' }, { id: 'testAgentServiceUserId' }];

describe('lib/representation-functions', () => {
	describe('filterRepresentationsBySubmittingParty', () => {
		it('returns representations submitted by an lpa', () => {
			const testCaseData = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: testStatements
			};

			const result = filterRepresentationsBySubmittingParty(testCaseData, LPA_USER_ROLE);
			expect(result).toEqual([lpaStatement]);
		});

		it('returns representations submitted by an appellant', () => {
			const testCaseData = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: testFinalComments
			};

			const result = filterRepresentationsBySubmittingParty(
				testCaseData,
				APPEAL_USER_ROLES.APPELLANT
			);
			expect(result).toEqual([appellantFinalComment]);
		});

		it('returns representations submitted by a rule 6 party', () => {
			const testCaseData = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: testStatements
			};

			const result = filterRepresentationsBySubmittingParty(
				testCaseData,
				APPEAL_USER_ROLES.RULE_6_PARTY
			);
			expect(result).toEqual([r6Statement]);
		});

		it('returns an empty array if there are no relevant representations', () => {
			const testCaseData1 = {
				caseReference: 'testReference1',
				users: testUsers,
				//Appellants do not submit statements
				Representations: testStatements
			};

			const testCaseData2 = {
				caseReference: 'testReference2',
				users: testUsers
			};

			const result1 = filterRepresentationsBySubmittingParty(
				testCaseData1,
				APPEAL_USER_ROLES.APPELLANT
			);
			const result2 = filterRepresentationsBySubmittingParty(
				testCaseData2,
				APPEAL_USER_ROLES.APPELLANT
			);
			expect(result1).toEqual([]);
			expect(result2).toEqual([]);
		});
	});

	describe('formatRepresentationHeading', () => {
		it('returns the heading for an lpa user viewing an lpa statement', () => {
			const heading = formatRepresentationHeading(
				REPRESENTATION_TYPES.STATEMENT,
				LPA_USER_ROLE,
				LPA_USER_ROLE
			);
			expect(heading).toEqual('Your statement');
		});

		it('returns the heading for an lpa user viewing an R6 statement', () => {
			const heading = formatRepresentationHeading(
				REPRESENTATION_TYPES.STATEMENT,
				LPA_USER_ROLE,
				APPEAL_USER_ROLES.RULE_6_PARTY
			);
			expect(heading).toEqual('Statements from other parties');
		});

		it('returns the heading for an lpa user viewing an lpa final comment', () => {
			const heading = formatRepresentationHeading(
				REPRESENTATION_TYPES.FINAL_COMMENT,
				LPA_USER_ROLE,
				LPA_USER_ROLE
			);
			expect(heading).toEqual('Your final comments');
		});

		it('returns the heading for an lpa user viewing an appellant final comment', () => {
			const heading = formatRepresentationHeading(
				REPRESENTATION_TYPES.FINAL_COMMENT,
				LPA_USER_ROLE,
				APPEAL_USER_ROLES.APPELLANT
			);
			expect(heading).toEqual("Appellant's final comments");
		});

		it('returns the heading for an appellant viewing an lpa statement', () => {
			const heading = formatRepresentationHeading(
				REPRESENTATION_TYPES.STATEMENT,
				APPEAL_USER_ROLES.APPELLANT,
				LPA_USER_ROLE
			);
			expect(heading).toEqual('Local planning authority statement');
		});

		it('returns the heading for an appellant viewing an R6 statement', () => {
			const heading = formatRepresentationHeading(
				REPRESENTATION_TYPES.STATEMENT,
				APPEAL_USER_ROLES.APPELLANT,
				APPEAL_USER_ROLES.RULE_6_PARTY
			);
			expect(heading).toEqual('Statements from other parties');
		});

		it('returns the heading for an appellant viewing an appellant final comment', () => {
			const heading = formatRepresentationHeading(
				REPRESENTATION_TYPES.FINAL_COMMENT,
				APPEAL_USER_ROLES.APPELLANT,
				APPEAL_USER_ROLES.APPELLANT
			);
			expect(heading).toEqual('Your final comments');
		});

		it('returns the heading for an appellant viewing an lpa final comment', () => {
			const heading = formatRepresentationHeading(
				REPRESENTATION_TYPES.FINAL_COMMENT,
				APPEAL_USER_ROLES.APPELLANT,
				LPA_USER_ROLE
			);
			expect(heading).toEqual('Local planning authority final comments');
		});

		it('returns the heading for viewing interested party comments', () => {
			const heading1 = formatRepresentationHeading(
				REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
				APPEAL_USER_ROLES.APPELLANT,
				APPEAL_USER_ROLES.INTERESTED_PARTY
			);
			const heading2 = formatRepresentationHeading(
				REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
				APPEAL_USER_ROLES.RULE_6_PARTY,
				APPEAL_USER_ROLES.INTERESTED_PARTY
			);
			const heading3 = formatRepresentationHeading(
				REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
				LPA_USER_ROLE,
				APPEAL_USER_ROLES.INTERESTED_PARTY
			);

			expect(heading1).toEqual('Interested Party Comments');
			expect(heading2).toEqual('Interested Party Comments');
			expect(heading3).toEqual('Interested Party Comments');
		});
	});

	describe('formatRepresentations', () => {
		it('formats an array of statements', () => {
			const formattedRepresentations = formatRepresentations(testStatements);
			const expectedResult = [
				{
					key: {
						text: `statement 1`
					},
					value: {
						text: 'this is a statement',
						truncatedText: 'this is a statement',
						truncated: false,
						documents: 'No'
					}
				},
				{
					key: {
						text: `statement 2`
					},
					value: {
						text: 'this is a bleep statement',
						truncatedText: 'this is a bleep statement',
						truncated: false,
						documents: 'No'
					}
				}
			];

			expect(formattedRepresentations).toEqual(expectedResult);
		});

		it('formats an array of final comments', () => {
			const formattedRepresentations = formatRepresentations(testFinalComments);
			const expectedResult = [
				{
					key: {
						text: `final_comment 1`
					},
					value: {
						text: 'this is a comment',
						truncatedText: 'this is a comment',
						truncated: false,
						documents: 'No'
					}
				},
				{
					key: {
						text: `final_comment 2`
					},
					value: {
						text: 'this is a bleep comment',
						truncatedText: 'this is a bleep comment',
						truncated: false,
						documents: 'No'
					}
				}
			];

			expect(formattedRepresentations).toEqual(expectedResult);
		});

		// it('formats an array of proofs of evidence', () => {
		// 	const formattedRepresentations = formatRepresentations(testProofsOfEvidence);
		// 	const expectedResult = [
		// 		{
		// 			key: {
		// 				text: `statement 1`
		// 			},
		// 			value: {
		// 				text: 'this is a statement',
		// 				truncatedText: 'this is a statement',
		// 				truncated: false,
		// 				documents: 'No'
		// 			}
		// 		},
		// 		{
		// 			key: {
		// 				text: `statement 2`
		// 			},
		// 			value: {
		// 				text: 'this is a bleep statement',
		// 				truncatedText: 'this is a bleep statement',
		// 				truncated: false,
		// 				documents: 'No'
		// 			}
		// 		}
		// 	];

		// 	expect(formattedRepresentations).toEqual(expectedResult);
		// });

		it('formats an array of interested party comments', () => {
			const formattedRepresentations = formatRepresentations(testInterestedPartyComments);
			const expectedResult = [
				{
					key: {
						text: `Interested party 1`
					},
					value: {
						text: 'this is an earlier interested party comment',
						truncatedText: 'this is an earlier interested party comment',
						truncated: false,
						documents: 'No'
					}
				},
				{
					key: {
						text: `Interested party 2`
					},
					value: {
						text: 'this is an interested party comment',
						truncatedText: 'this is an interested party comment',
						truncated: false,
						documents: 'No'
					}
				}
			];

			expect(formattedRepresentations).toEqual(expectedResult);
		});
	});
});
