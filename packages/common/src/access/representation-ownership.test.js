const {
	addOwnershipAndSubmissionDetailsToRepresentations,
	checkDocumentAccessByRepresentationOwner
} = require('./representation-ownership');
const {
	REPRESENTATION_TYPES,
	APPEAL_USER_ROLES,
	LPA_USER_ROLE
} = require('@pins/common/src/constants');
const { APPEAL_REPRESENTATION_STATUS } = require('pins-data-model');

const testR6ServiceUserId1 = 'testR6ServiceUserId1';
const testR6ServiceUserId2 = 'testR6ServiceUserId2';
const testLoggedInEmail = 'testEmail';
const testCaseReference = '12345';

const lpaStatement = {
	id: 'lpaStatement1',
	representationId: 'testLpaStatement1',
	caseReference: testCaseReference,
	source: 'lpa',
	status: 'published',
	userOwnsRepresentation: true,
	originalRepresentation: 'this is a rude statement',
	redacted: true,
	redactedRepresentation: 'this is a bleep statement',
	representationType: REPRESENTATION_TYPES.STATEMENT,
	dateReceived: '2024-11-25 09:00:00.0000000',
	RepresentationDocuments: []
};

const r6Party1Statement = {
	id: 'r6Statement1',
	representationId: 'r6Party1Statement',
	caseReference: testCaseReference,
	source: 'citizen',
	status: 'published',
	userOwnsRepresentation: true,
	serviceUserId: testR6ServiceUserId1,
	originalRepresentation: 'this is a statement',
	redacted: false,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	dateReceived: '2024-11-04 09:00:00.0000000',
	RepresentationDocuments: []
};

const r6Party2Statement = {
	id: 'r6Statement2',
	representationId: 'r6Party2Statement',
	caseReference: testCaseReference,
	source: 'citizen',
	status: 'published',
	userOwnsRepresentation: false,
	serviceUserId: testR6ServiceUserId2,
	originalRepresentation: 'this is a different r6 statement',
	redacted: false,
	representationType: REPRESENTATION_TYPES.STATEMENT,
	dateReceived: '2024-11-05 09:00:00.0000000',
	RepresentationDocuments: []
};

const interestedPartyComment1 = {
	id: 'interestedPartyComment1',
	representationId: 'testInterestedPartyComment1',
	caseReference: testCaseReference,
	source: 'citizen',
	status: 'published',
	userOwnsRepresentation: false,
	originalRepresentation: 'this is an interested party comment',
	redacted: false,
	representationType: REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT,
	dateReceived: '2024-11-04 09:00:00.0000000',
	RepresentationDocuments: []
};

const testStatements = [lpaStatement, r6Party1Statement, r6Party2Statement];

describe('representations/service', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('addOwnershipAndSubmissionDetailsToRepresentations', () => {
		it('marks interested party comments ownership as false, sets submitting party', () => {
			const expectedResult = structuredClone(interestedPartyComment1);
			expectedResult.userOwnsRepresentation = false;
			expectedResult.submittingPartyType = APPEAL_USER_ROLES.INTERESTED_PARTY;

			const result = addOwnershipAndSubmissionDetailsToRepresentations(
				[interestedPartyComment1],
				testLoggedInEmail,
				false,
				[]
			);
			expect(result).toEqual([expectedResult]);
		});

		it('marks lpa representation ownership as false if not lpa user logged in, marks submitting party', () => {
			const expectedResult = structuredClone(lpaStatement);
			expectedResult.userOwnsRepresentation = false;
			expectedResult.submittingPartyType = LPA_USER_ROLE;

			const result = addOwnershipAndSubmissionDetailsToRepresentations(
				[lpaStatement, r6Party1Statement],
				testLoggedInEmail,
				false,
				[]
			);
			expect(result).toContainEqual(expectedResult);
		});

		it('marks lpa representation ownership as true if lpa user logged in', () => {
			const expectedLpaRep = structuredClone(lpaStatement);
			expectedLpaRep.userOwnsRepresentation = true;
			expectedLpaRep.submittingPartyType = LPA_USER_ROLE;
			const expectedR6Rep = structuredClone(r6Party1Statement);
			expectedR6Rep.userOwnsRepresentation = false;
			expectedR6Rep.submittingPartyType = APPEAL_USER_ROLES.RULE_6_PARTY;

			const result = addOwnershipAndSubmissionDetailsToRepresentations(
				[lpaStatement, r6Party1Statement],
				testLoggedInEmail,
				true,
				[
					{
						id: testR6ServiceUserId1,
						emailAddress: 'testR6Email',
						serviceUserType: APPEAL_USER_ROLES.RULE_6_PARTY
					}
				]
			);
			expect(result).toContainEqual(expectedLpaRep);
			expect(result).toContainEqual(expectedR6Rep);
		});

		it('marks representation ownership based on logged in user', () => {
			const expectedLpaRep = structuredClone(lpaStatement);
			expectedLpaRep.userOwnsRepresentation = false;
			expectedLpaRep.submittingPartyType = LPA_USER_ROLE;
			const expectedR6Party1Rep = structuredClone(r6Party1Statement);
			expectedR6Party1Rep.userOwnsRepresentation = true;
			expectedR6Party1Rep.submittingPartyType = APPEAL_USER_ROLES.RULE_6_PARTY;
			const expectedR6Party2Rep = structuredClone(r6Party2Statement);
			expectedR6Party2Rep.userOwnsRepresentation = false;
			expectedR6Party2Rep.submittingPartyType = APPEAL_USER_ROLES.RULE_6_PARTY;

			const result = addOwnershipAndSubmissionDetailsToRepresentations(
				testStatements,
				testLoggedInEmail,
				false,
				[
					{
						id: testR6ServiceUserId1,
						emailAddress: testLoggedInEmail,
						serviceUserType: APPEAL_USER_ROLES.RULE_6_PARTY
					},
					{
						id: testR6ServiceUserId2,
						emailAddress: 'anotherEmail',
						serviceUserType: APPEAL_USER_ROLES.RULE_6_PARTY
					}
				]
			);
			expect(result).toContainEqual(expectedLpaRep);
			expect(result).toContainEqual(expectedR6Party1Rep);
			expect(result).toContainEqual(expectedR6Party2Rep);
		});
	});

	describe('checkDocumentAccessByRepresentationOwner', () => {
		it('should return true if representation is not in map', () => {
			const doc = { id: 'doc1' };

			expect(checkDocumentAccessByRepresentationOwner(doc, new Map())).toBe(true);
		});

		it('should return true if user owns representation and non published status', () => {
			const doc = { id: 'doc1' };
			const map = new Map();
			map.set('doc1', {
				userOwnsRepresentation: true,
				representationStatus: APPEAL_REPRESENTATION_STATUS.DRAFT
			});

			expect(checkDocumentAccessByRepresentationOwner(doc, map)).toBe(true);
		});

		it('should return true if representation published for non owner', () => {
			const doc = { id: 'doc1' };
			const map = new Map();
			map.set('doc1', {
				userOwnsRepresentation: false,
				representationStatus: APPEAL_REPRESENTATION_STATUS.PUBLISHED
			});

			expect(checkDocumentAccessByRepresentationOwner(doc, map)).toBe(true);
		});

		it('should return false if representation is not visible for user', () => {
			const doc = { id: 'doc2' };
			const map = new Map();
			map.set('doc2', {
				userOwnsRepresentation: false,
				representationStatus: APPEAL_REPRESENTATION_STATUS.DRAFT
			});

			expect(checkDocumentAccessByRepresentationOwner(doc, map)).toBe(false);
		});
	});
});
