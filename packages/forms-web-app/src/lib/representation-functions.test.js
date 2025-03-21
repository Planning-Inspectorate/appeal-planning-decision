const {
	filterRepresentationsForDisplay,
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
	representationStatus: 'published',
	userOwnsRepresentation: true,
	submittingPartyType: LPA_USER_ROLE,
	originalRepresentation: 'this is a rude statement',
	redacted: true,
	redactedRepresentation: 'this is a bleep statement',
	representationType: REPRESENTATION_TYPES.STATEMENT,
	dateReceived: '2024-11-25 09:00:00.0000000',
	RepresentationDocuments: []
};

const testAppellantServiceUserId = 'testAppellantServiceUserId';
const testR6ServiceUserId1 = 'testR6ServiceUserId1';
const testR6ServiceUserId2 = 'testR6ServiceUserId2';

const r6Statement1 = {
	id: 'r6Statement1',
	representationId: 'testStatement2',
	caseReference: 'testReference1',
	source: 'citizen',
	representationStatus: 'published',
	userOwnsRepresentation: true,
	submittingPartyType: APPEAL_USER_ROLES.RULE_6_PARTY,
	serviceUserId: testR6ServiceUserId1,
	originalRepresentation: 'this is a statement',
	redacted: false,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	dateReceived: '2024-11-04 09:00:00.0000000',
	RepresentationDocuments: []
};

const r6Statement2 = {
	id: 'r6Statement2',
	representationId: 'testStatement3',
	caseReference: 'testReference1',
	source: 'citizen',
	representationStatus: 'published',
	userOwnsRepresentation: false,
	submittingPartyType: APPEAL_USER_ROLES.RULE_6_PARTY,
	serviceUserId: testR6ServiceUserId2,
	originalRepresentation: 'this is a different r6 statement',
	redacted: false,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	dateReceived: '2024-11-05 09:00:00.0000000',
	RepresentationDocuments: []
};

const lpaFinalComment = {
	id: 'lpaFinalComment1',
	representationId: 'testFinalComment1',
	caseReference: 'testReference1',
	source: 'lpa',
	representationStatus: 'published',
	userOwnsRepresentation: true,
	submittingPartyType: LPA_USER_ROLE,
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
	representationStatus: 'published',
	userOwnsRepresentation: true,
	submittingPartyType: APPEAL_USER_ROLES.APPELLANT,
	serviceUserId: testAppellantServiceUserId,
	originalRepresentation: 'this is a comment',
	redacted: false,
	representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
	dateReceived: '2024-11-04 09:00:00.0000000',
	RepresentationDocuments: []
};

const unpublishedAppellantFinalComment = {
	id: 'appellantFinalComment2',
	representationId: 'testFinalComment3',
	caseReference: 'testReference1',
	source: 'citizen',
	representationStatus: 'awaiting_review',
	userOwnsRepresentation: true,
	submittingPartyType: APPEAL_USER_ROLES.APPELLANT,
	serviceUserId: testAppellantServiceUserId,
	originalRepresentation: 'this is an unpublished comment',
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
	representationStatus: 'published',
	userOwnsRepresentation: false,
	submittingPartyType: APPEAL_USER_ROLES.INTERESTED_PARTY,
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
	representationStatus: 'published',
	userOwnsRepresentation: false,
	submittingPartyType: APPEAL_USER_ROLES.INTERESTED_PARTY,
	originalRepresentation: 'this is an earlier interested party comment',
	redacted: false,
	representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
	dateReceived: '2024-11-03 09:00:00.0000000',
	RepresentationDocuments: []
};

const unpublishedInterestedPartyComment = {
	id: 'interestedPartyComment3',
	representationId: 'testInterestedPartyComment3',
	caseReference: 'testReference1',
	source: 'citizen',
	representationStatus: 'awaiting_review',
	userOwnsRepresentation: false,
	submittingPartyType: APPEAL_USER_ROLES.INTERESTED_PARTY,
	originalRepresentation: 'this is an unpublished interested party comment',
	redacted: false,
	representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
	dateReceived: '2024-11-03 09:00:00.0000000',
	RepresentationDocuments: []
};

const lpaProof1 = {
	id: 'lpaProof1',
	representationId: 'testLpaProof1',
	caseReference: 'testReference1',
	source: 'lpa',
	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
	dateReceived: '2024-11-25 09:00:00.0000000',
	RepresentationDocuments: []
};

const appellantProof1 = {
	id: 'apellantProof1',
	representationId: 'testAppellantProof1',
	caseReference: 'testReference1',
	source: 'citizen',
	serviceUserId: 'testAppellantServiceUserId',
	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
	dateReceived: '2024-11-25 09:00:00.0000000',
	RepresentationDocuments: []
};

const rule6Proof1 = {
	id: 'rule6Proof1',
	representationId: 'testrule6Proof1',
	caseReference: 'testReference1',
	source: 'citizen',
	serviceUserId: 'testR6ServiceUserId',
	representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
	dateReceived: '2024-11-25 09:00:00.0000000',
	RepresentationDocuments: []
};

const testStatements = [lpaStatement, r6Statement1, r6Statement2];

const testFinalComments = [lpaFinalComment, appellantFinalComment];

const testInterestedPartyComments = [
	interestedPartyComment1,
	interestedPartyComment2,
	unpublishedInterestedPartyComment
];

const testProofsOfEvidence = [lpaProof1, appellantProof1, rule6Proof1];

const testUsers = [{ id: 'testAppellantServiceUserId' }, { id: 'testAgentServiceUserId' }];

describe('lib/representation-functions', () => {
	describe('filterRepresentationsForDisplay', () => {
		it('returns published representations submitted by an lpa', () => {
			const testCaseData = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: testStatements
			};

			const testRepresentationParams = {
				userType: LPA_USER_ROLE,
				representationType: REPRESENTATION_TYPES.STATEMENT,
				submittingParty: LPA_USER_ROLE
			};

			const result = filterRepresentationsForDisplay(testCaseData, testRepresentationParams);
			expect(result).toEqual([lpaStatement]);
		});

		it('returns published representations submitted by an appellant', () => {
			const testCaseData = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: testFinalComments
			};

			const testRepresentationParams = {
				userType: LPA_USER_ROLE,
				representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			};

			const result = filterRepresentationsForDisplay(testCaseData, testRepresentationParams);
			expect(result).toEqual([appellantFinalComment]);
		});

		it('returns representations submitted by a rule 6 party', () => {
			const testCaseData = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: testStatements
			};

			const testRepresentationParams = {
				userType: LPA_USER_ROLE,
				representationType: REPRESENTATION_TYPES.STATEMENT,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
			};

			const result = filterRepresentationsForDisplay(testCaseData, testRepresentationParams);
			expect(result).toEqual([r6Statement1, r6Statement2]);
		});

		it('returns rule 6 party representations submitted by the rule 6 party viewing them', () => {
			const testCaseData = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: testStatements
			};

			const testRepresentationParams = {
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				representationType: REPRESENTATION_TYPES.STATEMENT,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY,
				rule6OwnRepresentations: true
			};

			const result = filterRepresentationsForDisplay(testCaseData, testRepresentationParams);
			expect(result).toEqual([r6Statement1]);
		});

		it('returns rule 6 party representations submitted by other rule 6 parties', () => {
			const testCaseData = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: testStatements
			};

			const testRepresentationParams = {
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				representationType: REPRESENTATION_TYPES.STATEMENT,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
			};

			const result = filterRepresentationsForDisplay(testCaseData, testRepresentationParams);
			expect(result).toEqual([r6Statement2]);
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

			const testRepresentationParams = {
				userType: APPEAL_USER_ROLES.APPELLANT,
				representationType: REPRESENTATION_TYPES.STATEMENT,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			};

			const result1 = filterRepresentationsForDisplay(testCaseData1, testRepresentationParams);
			const result2 = filterRepresentationsForDisplay(testCaseData2, testRepresentationParams);
			expect(result1).toEqual([]);
			expect(result2).toEqual([]);
		});

		it('does not return unpublished representations if not owned by user', () => {
			const testCaseData1 = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: testInterestedPartyComments
			};

			const testRepresentationParams = {
				userType: APPEAL_USER_ROLES.APPELLANT,
				representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
				submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
			};

			const result = filterRepresentationsForDisplay(testCaseData1, testRepresentationParams);
			expect(result).toEqual([interestedPartyComment1, interestedPartyComment2]);
		});

		it('returns unpublished representations only if owned by user', () => {
			const unpublishedAppellantFinalComment2 = structuredClone(unpublishedAppellantFinalComment);
			unpublishedAppellantFinalComment2.userOwnsRepresentation = false;

			const testCaseData1 = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: [lpaFinalComment, unpublishedAppellantFinalComment]
			};

			const testCaseData2 = {
				caseReference: 'testReference1',
				users: testUsers,
				Representations: [lpaFinalComment, unpublishedAppellantFinalComment2]
			};

			const testAppellantRepresentationParams = {
				userType: APPEAL_USER_ROLES.APPELLANT,
				representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			};

			const result1 = filterRepresentationsForDisplay(
				testCaseData1,
				testAppellantRepresentationParams
			);
			const result2 = filterRepresentationsForDisplay(
				testCaseData2,
				testAppellantRepresentationParams
			);
			expect(result1).toEqual([unpublishedAppellantFinalComment]);
			expect(result2).toEqual([]);
		});
	});

	describe('formatRepresentationHeading', () => {
		it('returns the heading for an lpa user viewing an lpa statement', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.STATEMENT,
				userType: LPA_USER_ROLE,
				submittingParty: LPA_USER_ROLE
			});
			expect(heading).toEqual('Your statement');
		});

		it('returns the heading for an lpa user viewing an R6 statement', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.STATEMENT,
				userType: LPA_USER_ROLE,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
			});
			expect(heading).toEqual('Statements from other parties');
		});

		it('returns the heading for an lpa user viewing an lpa final comment', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
				userType: LPA_USER_ROLE,
				submittingParty: LPA_USER_ROLE
			});
			expect(heading).toEqual('Your final comments');
		});

		it('returns the heading for an lpa user viewing an appellant final comment', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
				userType: LPA_USER_ROLE,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			});
			expect(heading).toEqual("Appellant's final comments");
		});

		it('returns the heading for an lpa user viewing an lpa proofs of evidence', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
				userType: LPA_USER_ROLE,
				submittingParty: LPA_USER_ROLE
			});
			expect(heading).toEqual('Your proof of evidence and witnesses');
		});

		it('returns the heading for an lpa user viewing an appellant proofs of evidence', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
				userType: LPA_USER_ROLE,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			});
			expect(heading).toEqual('Appellant’s proof of evidence and witnesses');
		});

		it('returns the heading for an lpa user viewing an R6 proofs of evidence', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
				userType: LPA_USER_ROLE,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
			});
			expect(heading).toEqual('Proof of evidence and witnesses from other parties');
		});

		it('returns the heading for an appellant viewing an lpa statement', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.STATEMENT,
				userType: APPEAL_USER_ROLES.APPELLANT,
				submittingParty: LPA_USER_ROLE
			});
			expect(heading).toEqual('Local planning authority statement');
		});

		it('returns the heading for an appellant viewing an R6 statement', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.STATEMENT,
				userType: APPEAL_USER_ROLES.APPELLANT,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
			});
			expect(heading).toEqual('Statements from other parties');
		});

		it('returns the heading for an appellant viewing an appellant final comment', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
				userType: APPEAL_USER_ROLES.APPELLANT,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			});
			expect(heading).toEqual('Your final comments');
		});

		it('returns the heading for an appellant viewing an lpa final comment', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
				userType: APPEAL_USER_ROLES.APPELLANT,
				submittingParty: LPA_USER_ROLE
			});
			expect(heading).toEqual('Local planning authority final comments');
		});

		it('returns the heading for an appellant viewing an lpa proofs of evidence', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
				userType: APPEAL_USER_ROLES.APPELLANT,
				submittingParty: LPA_USER_ROLE
			});
			expect(heading).toEqual('Local planning authority proof of evidence and witnesses');
		});

		it('returns the heading for an appellant viewing an appellant proofs of evidence', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
				userType: APPEAL_USER_ROLES.APPELLANT,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			});
			expect(heading).toEqual('Your proof of evidence and witnesses');
		});

		it('returns the heading for an appellant user viewing an R6 proofs of evidence', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
				userType: APPEAL_USER_ROLES.APPELLANT,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
			});
			expect(heading).toEqual('Proof of evidence and witnesses from other parties');
		});

		it('returns the heading for an r6 user viewing an lpa statement', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.STATEMENT,
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				submittingParty: LPA_USER_ROLE
			});
			expect(heading).toEqual('Local planning authority statement');
		});

		it('returns the heading for an r6 user viewing own R6 statement', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.STATEMENT,
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY,
				rule6OwnRepresentations: true
			});
			expect(heading).toEqual('Your statement');
		});

		it('returns the heading for an r6 user viewing other R6 statement', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.STATEMENT,
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
			});
			expect(heading).toEqual('Statements from other parties');
		});

		it('returns the heading for an r6 user viewing an appellant final comment', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			});
			expect(heading).toEqual("Appellant's final comments");
		});

		it('returns the heading for an r6 user viewing an lpa final comment', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				submittingParty: LPA_USER_ROLE
			});
			expect(heading).toEqual('Local planning authority final comments');
		});

		it('returns the heading for an r6 user viewing an lpa proofs of evidence', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				submittingParty: LPA_USER_ROLE
			});
			expect(heading).toEqual('Local planning authority proof of evidence and witnesses');
		});

		it('returns the heading for an r6 user viewing an appellant proofs of evidence', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				submittingParty: APPEAL_USER_ROLES.APPELLANT
			});
			expect(heading).toEqual('Appellant’s proof of evidence and witnesses');
		});

		it('returns the heading for an r6 user user viewing own R6 proofs of evidence', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY,
				rule6OwnRepresentations: true
			});
			expect(heading).toEqual('Your proof of evidence and witnesses');
		});

		it('returns the heading for an r6 user user viewing other R6 proofs of evidence', () => {
			const heading = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				submittingParty: APPEAL_USER_ROLES.RULE_6_PARTY
			});
			expect(heading).toEqual('Proof of evidence and witnesses from other parties');
		});

		it('returns the heading for viewing interested party comments', () => {
			const heading1 = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
				userType: APPEAL_USER_ROLES.APPELLANT,
				submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
			});
			const heading2 = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
				userType: APPEAL_USER_ROLES.RULE_6_PARTY,
				submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
			});
			const heading3 = formatRepresentationHeading({
				representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
				userType: LPA_USER_ROLE,
				submittingParty: APPEAL_USER_ROLES.INTERESTED_PARTY
			});

			expect(heading1).toEqual('Interested Party Comments');
			expect(heading2).toEqual('Interested Party Comments');
			expect(heading3).toEqual('Interested Party Comments');
		});
	});

	describe('formatRepresentations', () => {
		it('formats an array of statements', async () => {
			const formattedRepresentations = formatRepresentations({}, testStatements);
			const expectedResult = [
				{
					key: {
						text: `Statement 1`
					},
					rowLabel: 'Statement',
					value: {
						text: 'this is a statement',
						truncatedText: 'this is a statement',
						truncated: false,
						documents: [{ documentsLabel: 'Supporting documents', documentsLinks: 'No documents' }]
					}
				},
				{
					key: {
						text: `Statement 2`
					},
					rowLabel: 'Statement',
					value: {
						text: 'this is a different r6 statement',
						truncatedText: 'this is a different r6 statement',
						truncated: false,
						documents: [{ documentsLabel: 'Supporting documents', documentsLinks: 'No documents' }]
					}
				},
				{
					key: {
						text: `Statement 3`
					},
					rowLabel: 'Statement',
					value: {
						text: 'this is a bleep statement',
						truncatedText: 'this is a bleep statement',
						truncated: false,
						documents: [{ documentsLabel: 'Supporting documents', documentsLinks: 'No documents' }]
					}
				}
			];

			expect(formattedRepresentations).toEqual(expectedResult);
		});

		it('formats an array of final comments', async () => {
			const formattedRepresentations = await formatRepresentations({}, testFinalComments);
			const expectedResult = [
				{
					key: {
						text: `Final comments 1`
					},
					rowLabel: 'Final comments',
					value: {
						text: 'this is a comment',
						truncatedText: 'this is a comment',
						truncated: false,
						documents: [{ documentsLabel: 'Supporting documents', documentsLinks: 'No documents' }]
					}
				},
				{
					key: {
						text: `Final comments 2`
					},
					rowLabel: 'Final comments',
					value: {
						text: 'this is a bleep comment',
						truncatedText: 'this is a bleep comment',
						truncated: false,
						documents: [{ documentsLabel: 'Supporting documents', documentsLinks: 'No documents' }]
					}
				}
			];

			expect(formattedRepresentations).toEqual(expectedResult);
		});

		it('formats an array of proofs of evidence', () => {
			const formattedRepresentations = formatRepresentations({}, testProofsOfEvidence);
			const expectedResult = [
				{
					key: { text: 'Representation 1' },
					rowLabel: 'Representation',
					value: {
						text: undefined,
						truncatedText: undefined,
						truncated: false,
						documents: [
							{ documentsLabel: 'Proof of evidence and summary', documentsLinks: 'No documents' },
							{ documentsLabel: 'Witnesses and their evidence', documentsLinks: 'No documents' }
						]
					}
				},
				{
					key: { text: 'Representation 2' },
					rowLabel: 'Representation',
					value: {
						text: undefined,
						truncatedText: undefined,
						truncated: false,
						documents: [
							{ documentsLabel: 'Proof of evidence and summary', documentsLinks: 'No documents' },
							{ documentsLabel: 'Witnesses and their evidence', documentsLinks: 'No documents' }
						]
					}
				},
				{
					key: { text: 'Representation 3' },
					rowLabel: 'Representation',
					value: {
						text: undefined,
						truncatedText: undefined,
						truncated: false,
						documents: [
							{ documentsLabel: 'Proof of evidence and summary', documentsLinks: 'No documents' },
							{ documentsLabel: 'Witnesses and their evidence', documentsLinks: 'No documents' }
						]
					}
				}
			];
			expect(formattedRepresentations).toEqual(expectedResult);
		});

		it('formats an array of interested party comments', async () => {
			const formattedRepresentations = await formatRepresentations({}, [
				interestedPartyComment1,
				interestedPartyComment2
			]);
			const expectedResult = [
				{
					key: {
						text: `Interested party 1`
					},
					rowLabel: 'Interested party',
					value: {
						text: 'this is an earlier interested party comment',
						truncatedText: 'this is an earlier interested party comment',
						truncated: false,
						documents: [{ documentsLabel: 'Supporting documents', documentsLinks: 'No documents' }]
					}
				},
				{
					key: {
						text: `Interested party 2`
					},
					rowLabel: 'Interested party',
					value: {
						text: 'this is an interested party comment',
						truncatedText: 'this is an interested party comment',
						truncated: false,
						documents: [{ documentsLabel: 'Supporting documents', documentsLinks: 'No documents' }]
					}
				}
			];

			expect(formattedRepresentations).toEqual(expectedResult);
		});

		it('formats related document links', async () => {
			const caseData = {
				Documents: [
					{ id: 1, filename: 'test.txt' },
					{ id: 2, filename: 'test2.txt', redacted: true },
					{ id: 3, filename: '<test3.txt>' }
				]
			};
			const formattedRepresentations = formatRepresentations(caseData, [
				{ ...lpaStatement, RepresentationDocuments: [{ documentId: 1 }, { documentId: 2 }] },
				{ ...r6Statement2, RepresentationDocuments: [{ documentId: 3 }] }
			]);
			const expectedResult = [
				{
					key: {
						text: `Statement 1`
					},
					rowLabel: 'Statement',
					value: {
						text: r6Statement2.originalRepresentation,
						truncatedText: r6Statement2.originalRepresentation,
						truncated: false,
						documents: [
							{
								documentsLabel: 'Supporting documents',
								documentsLinks: '&lt;test3.txt&gt; - awaiting review'
							}
						]
					}
				},
				{
					key: {
						text: `Statement 2`
					},
					rowLabel: 'Statement',
					value: {
						text: lpaStatement.redactedRepresentation,
						truncatedText: lpaStatement.redactedRepresentation,
						truncated: false,
						documents: [
							{
								documentsLabel: 'Supporting documents',
								documentsLinks: `test.txt - awaiting review<br><a href="/published-document/2" class="govuk-link">test2.txt</a>`
							}
						]
					}
				}
			];

			expect(formattedRepresentations).toEqual(expectedResult);
		});
	});
});
