const { formatter } = require('./representation');
const { APPEAL_REPRESENTATION_TYPE } = require('@planning-inspectorate/data-model');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');

const expectedNewIPUser = {
	salutation: null,
	firstName: 'Testy',
	lastName: 'McTest',
	emailAddress: 'testEmail@test.com',
	serviceUserType: 'InterestedParty',
	telephoneNumber: null,
	organisation: null
};

jest.mock('./utils', () => ({
	getDocuments: jest.fn(() => [1]),
	createInterestedPartyNewUser: jest.fn(() => expectedNewIPUser)
}));
describe('Representation Formatter', () => {
	let submission;
	const caseReference = 'CASE123';

	beforeEach(() => {
		jest.clearAllMocks();

		submission = {
			id: 'submission1',
			AppealCase: {
				LPACode: 'LPA001'
			},

			appellantFinalCommentDetails: 'Appellant final comment text',
			lpaFinalCommentDetails: 'LPA final comment text',
			lpaStatement: 'LPA statement text',
			rule6Statement: 'Rule6 statement text'
		};
	});

	it('should format a FINAL_COMMENT submission from LPA (no serviceUserId)', async () => {
		const result = await formatter({
			caseReference,
			repType: APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT,
			party: LPA_USER_ROLE,
			representationSubmission: submission
		});

		expect(result.caseReference).toBe(caseReference);
		expect(result.representation).toBe('LPA final comment text');
		expect(result.representationType).toBe('final_comment');
		expect(result).not.toHaveProperty('serviceUserId');
		expect(result.lpaCode).toBe('LPA001');
		expect(result.documents).toEqual([1]);
		expect(typeof result.representationSubmittedDate).toBe('string');
	});

	it('should format a FINAL_COMMENT submission from Appellant (serviceUserId provided)', async () => {
		const serviceUserId = 'user123';
		const result = await formatter({
			caseReference,
			serviceUserId,
			repType: APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT,
			party: APPEAL_USER_ROLES.APPELLANT,
			representationSubmission: submission
		});

		expect(result.caseReference).toBe(caseReference);
		expect(result.representation).toBe('Appellant final comment text');
		expect(result.representationType).toBe('final_comment');
		expect(result.serviceUserId).toBe(serviceUserId);
		expect(result).not.toHaveProperty('lpaCode');
		expect(result.documents).toEqual([1]);
	});

	it('should format a STATEMENT submission from Rule6 (serviceUserId provided)', async () => {
		const serviceUserId = 'user124';
		const result = await formatter({
			caseReference,
			serviceUserId,
			repType: APPEAL_REPRESENTATION_TYPE.STATEMENT,
			party: APPEAL_USER_ROLES.RULE_6_PARTY,
			representationSubmission: submission
		});

		expect(result.representation).toBe('Rule6 statement text');
		expect(result.representationType).toBe('statement');
		expect(result.serviceUserId).toBe(serviceUserId);
		expect(result).not.toHaveProperty('lpaCode');
		expect(result.documents).toEqual([1]);
	});

	it('should format a STATEMENT submission from LPA (no serviceUserId)', async () => {
		const result = await formatter({
			caseReference,
			repType: APPEAL_REPRESENTATION_TYPE.STATEMENT,
			party: LPA_USER_ROLE,
			representationSubmission: submission
		});

		expect(result.representation).toBe('LPA statement text');
		expect(result.representationType).toBe('statement');
		expect(result).not.toHaveProperty('serviceUserId');
		expect(result.lpaCode).toBe('LPA001');
		expect(result.documents).toEqual([1]);
	});

	it('should set representation to null for PROOFS_EVIDENCE rep type', async () => {
		const result = await formatter({
			caseReference,
			repType: APPEAL_REPRESENTATION_TYPE.PROOFS_EVIDENCE,
			party: LPA_USER_ROLE,
			representationSubmission: submission
		});
		expect(result.representation).toBeNull();
	});

	it('should format a COMMENT submission ', async () => {
		const ipSubmission = {
			id: '123',
			caseReference,
			firstName: 'Testy',
			lastName: 'McTest',
			addressLine1: null,
			addressLine2: null,
			townCity: null,
			county: null,
			postcode: null,
			emailAddress: 'testEmail@test.com',
			comments: 'some test comments',
			createdAt: new Date(),
			AppealCase: { LPACode: 'test456', appealTypeCode: 'S78' }
		};

		const result = await formatter({
			caseReference,
			repType: APPEAL_REPRESENTATION_TYPE.COMMENT,
			party: APPEAL_USER_ROLES.INTERESTED_PARTY,
			representationSubmission: ipSubmission
		});

		expect(result.representation).toBe('some test comments');
		expect(result.representationType).toBe('comment');
		expect(result.newUser).toBe(expectedNewIPUser);
		expect(result).not.toHaveProperty('serviceUserId');
		expect(result).not.toHaveProperty('lpaCode');
		expect(result.documents).toEqual([]);
	});

	it('should throw an error if representationSubmission is not provided', async () => {
		await expect(
			formatter({
				caseReference,
				repType: APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT,
				party: LPA_USER_ROLE,
				representationSubmission: null
			})
		).rejects.toThrow('Representation submission could not be formatted');
	});
});
