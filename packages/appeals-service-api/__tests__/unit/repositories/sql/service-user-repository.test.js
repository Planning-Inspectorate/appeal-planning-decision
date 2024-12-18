const { mockDeep, mockReset } = require('jest-mock-extended');
const { PrismaClient } = require('@prisma/client');
const { ServiceUserRepository } = require('#repositories/sql/service-user-repository');
const { SERVICE_USER_TYPE } = require('pins-data-model');
jest.mock('#repositories/sql/appeal-user-repository');

describe('ServiceUserRepository', () => {
	const mockPrismaClient = mockDeep(PrismaClient);
	const repository = new ServiceUserRepository(mockPrismaClient);

	afterEach(() => {
		jest.clearAllMocks();
		mockReset(mockPrismaClient);
	});

	describe('getServiceUserByIdAndCaseReference', () => {
		it('should return service user when found', async () => {
			const serviceUserId = 'user-id';
			const caseReference = 'case-ref';
			const expectedUser = { firstName: 'John', lastName: 'Doe' };

			mockPrismaClient.serviceUser.findFirst.mockResolvedValue(expectedUser);

			const result = await repository.getServiceUserByIdAndCaseReference(
				serviceUserId,
				caseReference
			);

			expect(result).toEqual(expectedUser);
			expect(mockPrismaClient.serviceUser.findFirst).toHaveBeenCalledWith({
				where: {
					AND: {
						id: serviceUserId,
						caseReference
					}
				},
				select: {
					firstName: true,
					lastName: true,
					serviceUserType: true
				}
			});
		});

		it('should return null when service user not found', async () => {
			const serviceUserId = 'user-id';
			const caseReference = 'case-ref';

			mockPrismaClient.serviceUser.findFirst.mockResolvedValue(null);

			const result = await repository.getServiceUserByIdAndCaseReference(
				serviceUserId,
				caseReference
			);

			expect(result).toBeNull();
			expect(mockPrismaClient.serviceUser.findFirst).toHaveBeenCalledWith({
				where: {
					AND: {
						id: serviceUserId,
						caseReference
					}
				},
				select: {
					firstName: true,
					lastName: true,
					serviceUserType: true
				}
			});
		});
	});

	describe('getForCaseAndType', () => {
		it('should return service users for given case reference and types', async () => {
			const caseReference = 'case-ref';
			const serviceUserTypes = [SERVICE_USER_TYPE.APPELLANT, SERVICE_USER_TYPE.AGENT];
			const expectedUsers = [
				{
					firstName: 'John',
					lastName: 'Doe',
					emailAddress: 'john@example.com',
					organisation: 'Org1',
					telephoneNumber: '1234567890',
					serviceUserType: SERVICE_USER_TYPE.APPELLANT,
					id: '123'
				},
				{
					firstName: 'Jane',
					lastName: 'Smith',
					emailAddress: 'jane@example.com',
					organisation: 'Org2',
					telephoneNumber: '0987654321',
					serviceUserType: SERVICE_USER_TYPE.AGENT,
					id: '234'
				}
			];

			mockPrismaClient.serviceUser.findMany.mockResolvedValue(expectedUsers);

			const result = await repository.getForCaseAndType(caseReference, serviceUserTypes);

			expect(result).toEqual(expectedUsers);
			expect(mockPrismaClient.serviceUser.findMany).toHaveBeenCalledWith({
				where: {
					OR: serviceUserTypes.map((type) => ({
						caseReference,
						serviceUserType: type
					}))
				},
				select: {
					firstName: true,
					lastName: true,
					emailAddress: true,
					organisation: true,
					telephoneNumber: true,
					serviceUserType: true,
					id: true
				}
			});
		});

		it('should return empty array when no service users found', async () => {
			const caseReference = 'case-ref';
			const serviceUserTypes = [SERVICE_USER_TYPE.APPELLANT, SERVICE_USER_TYPE.AGENT];

			mockPrismaClient.serviceUser.findMany.mockResolvedValue([]);

			const result = await repository.getForCaseAndType(caseReference, serviceUserTypes);

			expect(result).toEqual([]);
			expect(mockPrismaClient.serviceUser.findMany).toHaveBeenCalledWith({
				where: {
					OR: serviceUserTypes.map((type) => ({
						caseReference,
						serviceUserType: type
					}))
				},
				select: {
					firstName: true,
					lastName: true,
					emailAddress: true,
					organisation: true,
					telephoneNumber: true,
					serviceUserType: true,
					id: true
				}
			});
		});
	});

	describe('put', () => {
		it('should create a new service user when not found', async () => {
			const data = {
				id: 'user-id',
				caseReference: 'case-ref',
				emailAddress: 'john@example.com',
				serviceUserType: SERVICE_USER_TYPE.APPELLANT
			};

			mockPrismaClient.appealUser.findFirst.mockResolvedValue(null);
			mockPrismaClient.appealCase.findFirst.mockResolvedValue({ Appeal: { id: 'appeal-id' } });
			mockPrismaClient.serviceUser.findFirst.mockResolvedValue(null);
			mockPrismaClient.appealUser.create.mockResolvedValue({ id: 1 });
			mockPrismaClient.$transaction.mockImplementation(async (fn) => fn(mockPrismaClient));

			await repository.put(data);

			expect(mockPrismaClient.serviceUser.create).toHaveBeenCalledWith({ data });
		});

		it('should update an existing service user when found', async () => {
			const data = {
				id: 'user-id',
				caseReference: 'case-ref',
				emailAddress: 'john@example.com',
				serviceUserType: SERVICE_USER_TYPE.APPELLANT
			};
			const existingUser = { internalId: 'internal-id' };

			mockPrismaClient.appealUser.findFirst.mockResolvedValue(null);
			mockPrismaClient.appealCase.findFirst.mockResolvedValue({ Appeal: { id: 'appeal-id' } });
			mockPrismaClient.serviceUser.findFirst.mockResolvedValue(existingUser);
			mockPrismaClient.appealUser.create.mockResolvedValue({ id: 1 });
			mockPrismaClient.$transaction.mockImplementation(async (fn) => fn(mockPrismaClient));

			await repository.put(data);

			expect(mockPrismaClient.serviceUser.update).toHaveBeenCalledWith({
				where: { internalId: existingUser.internalId },
				data
			});
		});
	});
});
