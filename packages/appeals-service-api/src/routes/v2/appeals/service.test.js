const { getAppealsForUser } = require('./service');
const { UserAppealsRepository } = require('./repo');
const { getServiceUsersWithEmailsByIdAndCaseReference } = require('../service-users/service');
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
			getServiceUsersWithEmailsByIdAndCaseReference.mockResolvedValue([
				{ id: '20000000143', emailAddress: userEmail }
			]);
			addOwnershipAndSubmissionDetailsToRepresentations.mockReturnValue([
				{ id: 'rep1', serviceUserId: '20000000143', userOwnsRepresentation: true }
			]);

			const result = await getAppealsForUser(userId, role);

			expect(UserAppealsRepository.prototype.listAppealsForUser).toHaveBeenCalledWith(userId, role);
			expect(getServiceUsersWithEmailsByIdAndCaseReference).toHaveBeenCalledWith(
				['20000000143'],
				'0000001'
			);
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

			const result = await getAppealsForUser(userId, role);

			expect(getServiceUsersWithEmailsByIdAndCaseReference).not.toHaveBeenCalled();
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
			getServiceUsersWithEmailsByIdAndCaseReference.mockResolvedValue([
				{ id: '20000000143', emailAddress: userEmail }
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
});
