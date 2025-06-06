const mockDbClient = {
	submissionDocumentUpload: {
		findUnique: jest.fn(),
		findMany: jest.fn(),
		delete: jest.fn()
	},
	document: {
		findFirstOrThrow: jest.fn(),
		findMany: jest.fn()
	},
	representation: {
		findMany: jest.fn()
	},
	serviceUser: {
		findMany: jest.fn()
	},
	appealCase: {
		findFirst: jest.fn(),
		findUniqueOrThrow: jest.fn()
	},
	appealToUser: {
		findMany: jest.fn()
	},
	appellantSubmission: {
		findUniqueOrThrow: jest.fn()
	}
};
jest.mock('../db-client', () => ({
	createPrismaClient: jest.fn().mockReturnValue(mockDbClient)
}));
jest.mock('#lib/logger', () => ({
	error: jest.fn()
}));

const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const logger = require('#lib/logger');
const { DocumentsRepository } = require('./repository');

describe('DocumentsRepository', () => {
	let repo;

	beforeEach(() => {
		repo = new DocumentsRepository();
		jest.clearAllMocks();
	});

	describe('getSubmissionDocument', () => {
		it('should call findUnique with correct params', async () => {
			const id = 'doc123';
			const expected = {
				id,
				location: 'loc',
				originalFileName: 'file',
				appellantSubmissionId: 'sub',
				LPAQuestionnaireSubmission: { appealCaseReference: 'ref' }
			};
			mockDbClient.submissionDocumentUpload.findUnique.mockResolvedValue(expected);

			const result = await repo.getSubmissionDocument(id);

			expect(mockDbClient.submissionDocumentUpload.findUnique).toHaveBeenCalledWith({
				where: { id },
				select: expect.any(Object)
			});
			expect(result).toBe(expected);
		});
	});

	describe('getSubmissionDocumentsByCaseRef', () => {
		it('should call findMany with correct params', async () => {
			const caseRef = 'ref123';
			const expected = [{ location: 'loc', type: 't', originalFileName: 'f' }];
			mockDbClient.submissionDocumentUpload.findMany.mockResolvedValue(expected);

			const result = await repo.getSubmissionDocumentsByCaseRef(caseRef);

			expect(mockDbClient.submissionDocumentUpload.findMany).toHaveBeenCalledWith({
				where: { LPAQuestionnaireSubmission: { appealCaseReference: caseRef } },
				select: expect.any(Object)
			});
			expect(result).toBe(expected);
		});
	});

	describe('deleteSubmissionDocument', () => {
		it('should call delete with correct id', async () => {
			const id = 'delid';
			const expected = { id };
			mockDbClient.submissionDocumentUpload.delete.mockResolvedValue(expected);

			const result = await repo.deleteSubmissionDocument(id);

			expect(mockDbClient.submissionDocumentUpload.delete).toHaveBeenCalledWith({ where: { id } });
			expect(result).toBe(expected);
		});
	});

	describe('getDocumentWithAppeal', () => {
		it('should call findFirstOrThrow with id', async () => {
			const lookup = 'docid';
			const expected = {
				id: lookup,
				AppealCase: { LPACode: 'lpa', appealId: 'aid', appealTypeCode: 'atc' }
			};
			mockDbClient.document.findFirstOrThrow.mockResolvedValue(expected);

			const result = await repo.getDocumentWithAppeal(lookup);

			expect(mockDbClient.document.findFirstOrThrow).toHaveBeenCalledWith({
				where: { id: lookup },
				include: expect.any(Object)
			});
			expect(result).toBe(expected);
		});

		it('should call findFirstOrThrow with documentURI', async () => {
			const lookup = 'http://blob.uri';
			mockDbClient.document.findFirstOrThrow.mockResolvedValue({});

			await repo.getDocumentWithAppeal(lookup);

			expect(mockDbClient.document.findFirstOrThrow).toHaveBeenCalledWith(
				expect.objectContaining({ where: { documentURI: lookup } })
			);
		});
	});

	describe('getDocuments', () => {
		it('should throw if caseReference missing', async () => {
			await expect(repo.getDocuments({ documentType: 't' })).rejects.toThrow(
				'caseReference required'
			);
		});
		it('should call findMany with correct params', async () => {
			const params = { documentType: 't', caseReference: 'ref' };
			const expected = [{ id: 1 }];
			mockDbClient.document.findMany.mockResolvedValue(expected);

			const result = await repo.getDocuments(params);

			expect(mockDbClient.document.findMany).toHaveBeenCalledWith({
				where: { documentType: 't', caseReference: 'ref' }
			});
			expect(result).toBe(expected);
		});
	});

	describe('getDocumentsByTypes', () => {
		it('should throw if caseReference missing', async () => {
			await expect(repo.getDocumentsByTypes({ documentTypes: ['t'] })).rejects.toThrow(
				'caseReference required'
			);
		});

		it('should call findMany with correct params', async () => {
			const params = { documentTypes: ['t'], caseReference: 'ref' };
			const expected = [{ id: 1 }];
			mockDbClient.document.findMany.mockResolvedValue(expected);

			const result = await repo.getDocumentsByTypes(params);

			expect(mockDbClient.document.findMany).toHaveBeenCalledWith({
				where: { documentType: { in: params.documentTypes }, caseReference: params.caseReference }
			});
			expect(result).toBe(expected);
		});
	});

	describe('getRepresentationDocsByCaseReference', () => {
		it('should throw if caseReference missing', async () => {
			await expect(repo.getRepresentationDocsByCaseReference({})).rejects.toThrow(
				'caseReference required'
			);
		});

		it('should return representation documents for a valid caseReference', async () => {
			const params = { caseReference: 'ref', email: 'test@example.com', isLpa: false };
			const representations = [
				{
					serviceUserId: 'user1',
					representationStatus: 'VALID',
					source: 'PORTAL',
					representationType: 'APPELLANT',
					RepresentationDocuments: [{ documentId: 'doc1' }, { documentId: 'doc2' }]
				},
				{
					serviceUserId: 'user2',
					representationStatus: 'INVALID',
					source: 'EMAIL',
					representationType: 'AGENT',
					RepresentationDocuments: [{ documentId: 'doc3' }]
				}
			];
			const serviceUsersWithEmails = [
				{ id: 'user1', emailAddress: 'a@example.com', serviceUserType: 'Appellant' },
				{ id: 'user2', emailAddress: 'b@example.com', serviceUserType: 'Agent' }
			];
			mockDbClient.representation.findMany.mockResolvedValue(representations);
			mockDbClient.serviceUser.findMany.mockResolvedValue(serviceUsersWithEmails);

			const result = await repo.getRepresentationDocsByCaseReference(params);

			expect(result).toEqual([
				{
					documentId: 'doc1',
					userOwnsRepresentation: false,
					submittingPartyType: 'Appellant',
					representationStatus: 'VALID'
				},
				{
					documentId: 'doc2',
					userOwnsRepresentation: false,
					submittingPartyType: 'Appellant',
					representationStatus: 'VALID'
				},
				{
					documentId: 'doc3',
					userOwnsRepresentation: false,
					submittingPartyType: 'Agent',
					representationStatus: 'INVALID'
				}
			]);
		});

		it('should set userOwnsRepresentation true if user email matches service user', async () => {
			const params = { caseReference: 'ref', email: 'a@example.com', isLpa: false };
			const representations = [
				{
					serviceUserId: 'user1',
					representationStatus: 'VALID',
					source: 'PORTAL',
					representationType: 'APPELLANT',
					RepresentationDocuments: [{ documentId: 'doc1' }]
				}
			];
			const serviceUsersWithEmails = [
				{ id: 'user1', emailAddress: 'a@example.com', serviceUserType: 'Appellant' }
			];
			mockDbClient.representation.findMany.mockResolvedValue(representations);
			mockDbClient.serviceUser.findMany.mockResolvedValue(serviceUsersWithEmails);

			const result = await repo.getRepresentationDocsByCaseReference(params);

			expect(result).toEqual([
				{
					documentId: 'doc1',
					userOwnsRepresentation: true,
					submittingPartyType: 'Appellant',
					representationStatus: 'VALID'
				}
			]);
		});

		it('should return empty array if no representations found', async () => {
			const params = { caseReference: 'ref', email: 'test@example.com', isLpa: false };
			mockDbClient.representation.findMany.mockResolvedValue([]);

			const result = await repo.getRepresentationDocsByCaseReference(params);

			expect(result).toEqual([]);
		});
	});

	describe('getServiceUsersWithEmailsByIdAndCaseReference', () => {
		it('should return empty array if no serviceUserIds or caseReference', async () => {
			const result = await repo.getServiceUsersWithEmailsByIdAndCaseReference([], '');
			expect(result).toEqual([]);
		});

		it('should call findMany with correct params', async () => {
			const serviceUserIds = ['user1', 'user2'];
			const caseReference = 'ref123';
			const expected = [
				{ id: 'user1', emailAddress: '' },
				{ id: 'user2', emailAddress: '' }
			];
			mockDbClient.serviceUser.findMany.mockResolvedValue(expected);
			const result = await repo.getServiceUsersWithEmailsByIdAndCaseReference(
				serviceUserIds,
				caseReference
			);
			expect(mockDbClient.serviceUser.findMany).toHaveBeenCalledWith({
				where: {
					AND: {
						id: { in: serviceUserIds },
						caseReference
					}
				},
				select: { id: true, emailAddress: true, serviceUserType: true }
			});
			expect(result).toEqual(expected);
		});
	});

	describe('getAppealCase', () => {
		it('should call findFirst with correct params', async () => {
			const params = { caseReference: 'ref' };
			const expected = { appealId: 'aid', LPACode: 'lpa', appealTypeCode: 'atc' };
			mockDbClient.appealCase.findFirst.mockResolvedValue(expected);

			const result = await repo.getAppealCase(params);

			expect(mockDbClient.appealCase.findFirst).toHaveBeenCalledWith({
				where: { caseReference: 'ref' },
				select: expect.any(Object)
			});
			expect(result).toBe(expected);
		});
	});

	describe('getAppealUserRoles', () => {
		it('should call findMany with correct params', async () => {
			const params = { appealId: 'aid', userId: 'uid' };
			const expected = [{ appealId: 'aid', userId: 'uid', role: 'role' }];
			mockDbClient.appealToUser.findMany.mockResolvedValue(expected);

			const result = await repo.getAppealUserRoles(params);

			expect(mockDbClient.appealToUser.findMany).toHaveBeenCalledWith({
				where: params,
				select: expect.any(Object)
			});
			expect(result).toBe(expected);
		});
	});

	describe('lpaCanModifyCase', () => {
		it('should return true if found', async () => {
			mockDbClient.appealCase.findUniqueOrThrow.mockResolvedValue({ id: 'id' });
			const params = { caseReference: 'ref', userLpa: 'lpa' };

			const result = await repo.lpaCanModifyCase(params);

			expect(mockDbClient.appealCase.findUniqueOrThrow).toHaveBeenCalledWith({
				where: { caseReference: 'ref', LPACode: 'lpa' },
				select: { id: true }
			});
			expect(result).toBe(true);
		});
		it('should throw and log error if not found', async () => {
			const params = { caseReference: 'ref', userLpa: 'lpa' };
			const error = new Error('not found');
			mockDbClient.appealCase.findUniqueOrThrow.mockRejectedValue(error);

			await expect(repo.lpaCanModifyCase(params)).rejects.toThrow(
				'lpa does not have access to case: ref'
			);
			expect(logger.error).toHaveBeenCalledWith({ err: error }, 'invalid user access');
		});
	});

	describe('userOwnsAppealSubmission', () => {
		it('should return true if user owns submission', async () => {
			const params = { appellantSubmissionId: 'asid', userId: 'uid' };
			const resultObj = {
				Appeal: {
					Users: [
						{ userId: 'uid', role: APPEAL_USER_ROLES.APPELLANT },
						{ userId: 'other', role: APPEAL_USER_ROLES.AGENT }
					]
				}
			};
			mockDbClient.appellantSubmission.findUniqueOrThrow.mockResolvedValue(resultObj);

			const result = await repo.userOwnsAppealSubmission(params);

			expect(result).toBe(true);
		});
		it('should throw Forbidden if user not found in Users', async () => {
			const params = { appellantSubmissionId: 'asid', userId: 'uid' };
			const resultObj = {
				Appeal: {
					Users: [{ userId: 'other', role: APPEAL_USER_ROLES.APPELLANT }]
				}
			};
			mockDbClient.appellantSubmission.findUniqueOrThrow.mockResolvedValue(resultObj);

			await expect(repo.userOwnsAppealSubmission(params)).rejects.toThrow('Forbidden');
			expect(logger.error).toHaveBeenCalled();
		});
		it('should throw Forbidden if findUniqueOrThrow throws', async () => {
			const params = { appellantSubmissionId: 'asid', userId: 'uid' };
			const error = new Error('not found');
			mockDbClient.appellantSubmission.findUniqueOrThrow.mockRejectedValue(error);

			await expect(repo.userOwnsAppealSubmission(params)).rejects.toThrow('Forbidden');
			expect(logger.error).toHaveBeenCalledWith({ err: error }, 'invalid user access');
		});
	});
});
