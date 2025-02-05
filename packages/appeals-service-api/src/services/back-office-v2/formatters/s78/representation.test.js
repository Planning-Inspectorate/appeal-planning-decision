const { formatter } = require('./representation');
const { APPEAL_REPRESENTATION_TYPE } = require('pins-data-model');

jest.mock('../utils', () => ({
	getDocuments: jest.fn(() => [1])
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
		const result = await formatter(
			caseReference,
			null,
			APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT,
			submission
		);

		expect(result.caseData.caseReference).toBe(caseReference);
		expect(result.caseData.representation).toBe('LPA final comment text');
		expect(result.caseData.representationType).toBe('final_comment');
		expect(result.caseData.serviceUserId).toBeNull();
		expect(result.caseData.lpaCode).toBe('LPA001');
		expect(result.caseData.documents).toEqual([1]);
		expect(typeof result.caseData.representationSubmittedDate).toBe('string');
	});

	it('should format a FINAL_COMMENT submission from Appellant (serviceUserId provided)', async () => {
		const serviceUserId = 'user123';
		const result = await formatter(
			caseReference,
			serviceUserId,
			APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT,
			submission
		);

		expect(result.caseData.caseReference).toBe(caseReference);
		expect(result.caseData.representation).toBe('Appellant final comment text');
		expect(result.caseData.representationType).toBe('final_comment');
		expect(result.caseData.serviceUserId).toBe(serviceUserId);
		expect(result.caseData.lpaCode).toBeNull();
		expect(result.caseData.documents).toEqual([1]);
	});

	it('should format a STATEMENT submission from Rule6 (serviceUserId provided)', async () => {
		const serviceUserId = 'user124';
		const result = await formatter(
			caseReference,
			serviceUserId,
			APPEAL_REPRESENTATION_TYPE.STATEMENT,
			submission
		);

		expect(result.caseData.representation).toBe('Rule6 statement text');
		expect(result.caseData.representationType).toBe('statement');
		expect(result.caseData.serviceUserId).toBe(serviceUserId);
		expect(result.caseData.lpaCode).toBeNull();
		expect(result.caseData.documents).toEqual([1]);
	});

	it('should format a STATEMENT submission from LPA (no serviceUserId)', async () => {
		const result = await formatter(
			caseReference,
			null,
			APPEAL_REPRESENTATION_TYPE.STATEMENT,
			submission
		);

		expect(result.caseData.representation).toBe('LPA statement text');
		expect(result.caseData.representationType).toBe('statement');
		expect(result.caseData.serviceUserId).toBeNull();
		expect(result.caseData.lpaCode).toBe('LPA001');
		expect(result.caseData.documents).toEqual([1]);
	});

	it('should set representation to null for PROOFS_EVIDENCE rep type', async () => {
		const result = await formatter(
			caseReference,
			null,
			APPEAL_REPRESENTATION_TYPE.PROOFS_EVIDENCE,
			submission
		);
		expect(result.caseData.representation).toBeNull();
	});
	it('should throw an error if representationSubmission is not provided', async () => {
		await expect(
			formatter(caseReference, null, APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT, null)
		).rejects.toThrow('Representation submission could not be formatted');
	});
});
