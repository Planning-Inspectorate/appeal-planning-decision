const { getAppealsForUser, getAppealDraft } = require('./service');
const { UserAppealsRepository } = require('./repo');
const { AppealsRepository } = require('#repositories/appeals-repository');
const { getServiceUsersForMultipleCases } = require('../service-users/service');
const {
	addOwnershipAndSubmissionDetailsToRepresentations
} = require('@pins/common/src/access/representation-ownership');
const { appendLinkedCasesForMultipleAppeals } = require('../appeal-cases/service');

jest.mock('./repo');
jest.mock('../service-users/service');
jest.mock('@pins/common/src/access/representation-ownership');
jest.mock('../appeal-cases/service');
jest.mock('../appeal-cases/repo');
jest.mock('#db-client', () => ({
	createPrismaClient: jest.fn()
}));
jest.mock('#repositories/appeals-repository');

describe('appeals service v2', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getAppealsForUser', () => {
		it('should update representations with ownership', async () => {
			const userId = 'user-1';
			const role = 'Rule6Party';
			const userEmail = 'test@example.com';
			const mockUser = {
				email: userEmail,
				Appeals: [
					{
						Appeal: {
							AppealCase: {
								caseReference: '0000001',
								Representations: [{ id: 'rep1', serviceUserId: '20000000143' }]
							}
						}
					}
				]
			};

			UserAppealsRepository.prototype.listAppealsForUser.mockResolvedValue(mockUser);
			appendLinkedCasesForMultipleAppeals.mockImplementation((cases) => Promise.resolve(cases));
			getServiceUsersForMultipleCases.mockResolvedValue([
				{
					caseReference: '0000001',
					users: [{ id: '20000000143', emailAddress: userEmail }]
				}
			]);
			addOwnershipAndSubmissionDetailsToRepresentations.mockReturnValue([
				{ id: 'rep1', serviceUserId: '20000000143', userOwnsRepresentation: true }
			]);

			const result = await getAppealsForUser(userId, role);

			expect(UserAppealsRepository.prototype.listAppealsForUser).toHaveBeenCalledWith(userId, role);
			expect(getServiceUsersForMultipleCases).toHaveBeenCalledWith([
				{
					serviceUserIds: ['20000000143'],
					caseReference: '0000001'
				}
			]);
			expect(addOwnershipAndSubmissionDetailsToRepresentations).toHaveBeenCalledWith(
				expect.any(Array),
				userEmail,
				false,
				[{ id: '20000000143', emailAddress: userEmail }]
			);
			expect(result[0].Representations[0].userOwnsRepresentation).toBe(true);
		});

		it('should handle appeals with no representations', async () => {
			const userId = 'user-1';
			const role = 'Rule6Party';
			const mockUser = {
				email: 'test@example.com',
				Appeals: [
					{
						Appeal: {
							AppealCase: {
								caseReference: '0000001',
								Representations: []
							}
						}
					}
				]
			};

			UserAppealsRepository.prototype.listAppealsForUser.mockResolvedValue(mockUser);
			appendLinkedCasesForMultipleAppeals.mockImplementation((cases) => Promise.resolve(cases));
			getServiceUsersForMultipleCases.mockResolvedValue([]);

			const result = await getAppealsForUser(userId, role);

			expect(getServiceUsersForMultipleCases).toHaveBeenCalledWith([]);
			expect(result[0].Representations).toEqual([]);
		});

		it('should update Proof of Evidence representations with ownership', async () => {
			const userId = 'user-1';
			const role = 'Rule6Party';
			const userEmail = 'test@example.com';
			const mockUser = {
				email: userEmail,
				Appeals: [
					{
						Appeal: {
							AppealCase: {
								caseReference: '0000002',
								Representations: [
									{
										id: 'rep2',
										serviceUserId: '20000000143',
										representationType: 'proofs_evidence'
									}
								]
							}
						}
					}
				]
			};

			UserAppealsRepository.prototype.listAppealsForUser.mockResolvedValue(mockUser);
			appendLinkedCasesForMultipleAppeals.mockImplementation((cases) => Promise.resolve(cases));
			getServiceUsersForMultipleCases.mockResolvedValue([
				{
					caseReference: '0000002',
					users: [{ id: '20000000143', emailAddress: userEmail }]
				}
			]);
			addOwnershipAndSubmissionDetailsToRepresentations.mockReturnValue([
				{
					id: 'rep2',
					serviceUserId: '20000000143',
					userOwnsRepresentation: true,
					representationType: 'proofs_evidence'
				}
			]);

			const result = await getAppealsForUser(userId, role);

			expect(result[0].Representations[0].userOwnsRepresentation).toBe(true);
			expect(result[0].Representations[0].representationType).toBe('proofs_evidence');
		});
	});

	describe('getAppealDraft', () => {
		it('should return legacy draft submission from Cosmos', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-123';
			const legacyDraftId = 'legacy-draft-456';
			const mockLegacyDraft = {
				id: legacyDraftId,
				legacyAppealSubmissionId: legacyDraftId,
				legacyAppealSubmissionState: 'DRAFT',
				appellant: { firstName: 'John' }
			};
			const mockUser = {
				Appeals: [
					{
						Appeal: {
							legacyAppealSubmissionId: legacyDraftId,
							legacyAppealSubmissionState: 'DRAFT'
						}
					}
				]
			};

			UserAppealsRepository.prototype.getAppealDraft.mockResolvedValue(mockUser);
			AppealsRepository.prototype.getById.mockResolvedValue(mockLegacyDraft);

			const result = await getAppealDraft(userId, appealId);

			expect(UserAppealsRepository.prototype.getAppealDraft).toHaveBeenCalledWith(userId, appealId);
			expect(AppealsRepository.prototype.getById).toHaveBeenCalledWith(legacyDraftId);
			expect(result).toEqual(mockLegacyDraft);
		});

		it('should return v2 draft submission with AppellantSubmission', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-789';
			const mockV2Draft = {
				id: appealId,
				AppellantSubmission: {
					submitted: false,
					submissionId: 'sub-789'
				},
				appellant: { firstName: 'Jane' }
			};
			const mockUser = {
				Appeals: [
					{
						Appeal: mockV2Draft
					}
				]
			};

			UserAppealsRepository.prototype.getAppealDraft.mockResolvedValue(mockUser);

			const result = await getAppealDraft(userId, appealId);

			expect(UserAppealsRepository.prototype.getAppealDraft).toHaveBeenCalledWith(userId, appealId);
			expect(result).toEqual(mockV2Draft);
		});

		it('should prioritize legacy draft over v2 draft', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-mixed';
			const legacyDraftId = 'legacy-draft-999';
			const mockLegacyDraft = {
				id: legacyDraftId,
				legacyAppealSubmissionState: 'DRAFT'
			};
			const mockUser = {
				Appeals: [
					{
						Appeal: {
							legacyAppealSubmissionId: legacyDraftId,
							legacyAppealSubmissionState: 'DRAFT',
							AppellantSubmission: {
								submitted: false
							}
						}
					}
				]
			};

			UserAppealsRepository.prototype.getAppealDraft.mockResolvedValue(mockUser);
			AppealsRepository.prototype.getById.mockResolvedValue(mockLegacyDraft);

			const result = await getAppealDraft(userId, appealId);

			// Should return legacy draft and not v2 draft
			expect(AppealsRepository.prototype.getById).toHaveBeenCalled();
			expect(result).toEqual(mockLegacyDraft);
		});

		it('should handle multiple appeals and return the first valid draft', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-multi';
			const mockV2Draft = {
				id: 'appeal-2',
				AppellantSubmission: {
					submitted: false,
					submissionId: 'sub-2'
				}
			};
			const mockUser = {
				Appeals: [
					{
						Appeal: {
							id: 'appeal-1'
							// no draft here
						}
					},
					{
						Appeal: mockV2Draft
					}
				]
			};

			UserAppealsRepository.prototype.getAppealDraft.mockResolvedValue(mockUser);

			const result = await getAppealDraft(userId, appealId);

			expect(result).toEqual(mockV2Draft);
		});

		it('should filter null draft submission ids and find the valid one', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-filter';
			const legacyDraftId = 'legacy-draft-111';
			const mockLegacyDraft = {
				id: legacyDraftId,
				legacyAppealSubmissionState: 'DRAFT'
			};
			const mockUser = {
				Appeals: [
					{
						Appeal: {
							legacyAppealSubmissionId: null,
							legacyAppealSubmissionState: 'DRAFT'
						}
					},
					{
						Appeal: {
							legacyAppealSubmissionId: legacyDraftId,
							legacyAppealSubmissionState: 'DRAFT'
						}
					}
				]
			};

			UserAppealsRepository.prototype.getAppealDraft.mockResolvedValue(mockUser);
			AppealsRepository.prototype.getById.mockResolvedValue(mockLegacyDraft);

			const result = await getAppealDraft(userId, appealId);

			expect(result).toEqual(mockLegacyDraft);
		});

		it('should handle v2 draft when AppellantSubmission.submitted is false', async () => {
			const userId = 'user-1';
			const appealId = 'appeal-v2-draft';
			const mockV2Draft = {
				id: appealId,
				AppellantSubmission: {
					submitted: false
				}
			};
			const mockUser = {
				Appeals: [
					{
						Appeal: mockV2Draft
					}
				]
			};

			UserAppealsRepository.prototype.getAppealDraft.mockResolvedValue(mockUser);

			const result = await getAppealDraft(userId, appealId);

			expect(result).toEqual(mockV2Draft);
			expect(AppealsRepository.prototype.getById).not.toHaveBeenCalled();
		});
	});
});
