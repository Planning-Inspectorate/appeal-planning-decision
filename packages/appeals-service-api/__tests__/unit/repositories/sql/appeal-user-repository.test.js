const { mockDeep, mockReset } = require('jest-mock-extended');
const { PrismaClient } = require('@prisma/client');
const { APPEAL_USER_ROLES, STATUS_CONSTANTS } = require('@pins/common/src/constants');
const { AppealUserRepository } = require('#repositories/sql/appeal-user-repository');

describe('AppealUserRepository', () => {
	const mockPrismaClient = mockDeep(PrismaClient);
	const repository = new AppealUserRepository(mockPrismaClient);

	afterEach(() => {
		jest.clearAllMocks();
		mockReset(mockPrismaClient);
	});

	describe('createUser', () => {
		it('should create a new user', async () => {
			const user = { email: 'test@example.com', isLpaUser: true };
			mockPrismaClient.appealUser.create.mockResolvedValue(user);

			const result = await repository.createUser(user);

			expect(mockPrismaClient.appealUser.create).toHaveBeenCalledWith({ data: user });
			expect(result).toEqual(user);
		});

		it('should set lpaStatus and isLpaAdmin for LPA users', async () => {
			const user = { email: 'test@example.com', isLpaUser: true };
			const expectedUser = { ...user, lpaStatus: STATUS_CONSTANTS.ADDED, isLpaAdmin: false };
			mockPrismaClient.appealUser.create.mockResolvedValue(expectedUser);

			const result = await repository.createUser(user);

			expect(mockPrismaClient.appealUser.create).toHaveBeenCalledWith({ data: expectedUser });
			expect(result).toEqual(expectedUser);
		});
	});

	describe('updateUser', () => {
		it('should update an existing user', async () => {
			const user = { id: '1', email: 'test@example.com' };
			mockPrismaClient.appealUser.update.mockResolvedValue(user);

			const result = await repository.updateUser(user);

			expect(mockPrismaClient.appealUser.update).toHaveBeenCalledWith({
				data: user,
				where: { id: user.id }
			});
			expect(result).toEqual(user);
		});
	});

	describe('search', () => {
		it('should search users with given options', async () => {
			const searchOptions = { email: 'test@example.com' };
			const users = [{ id: '1', email: 'test@example.com' }];
			mockPrismaClient.appealUser.findMany.mockResolvedValue(users);

			const result = await repository.search(searchOptions);

			expect(mockPrismaClient.appealUser.findMany).toHaveBeenCalledWith({ where: searchOptions });
			expect(result).toEqual(users);
		});
	});

	describe('getByEmail', () => {
		it('should get a user by email', async () => {
			const email = 'test@example.com';
			const user = { id: '1', email };
			mockPrismaClient.appealUser.findUnique.mockResolvedValue(user);

			const result = await repository.getByEmail(email);

			expect(mockPrismaClient.appealUser.findUnique).toHaveBeenCalledWith({ where: { email } });
			expect(result).toEqual(user);
		});
	});

	describe('getById', () => {
		it('should get a user by id', async () => {
			const id = '1';
			const user = { id, email: 'test@example.com' };
			mockPrismaClient.appealUser.findUnique.mockResolvedValue(user);

			const result = await repository.getById(id);

			expect(mockPrismaClient.appealUser.findUnique).toHaveBeenCalledWith({ where: { id } });
			expect(result).toEqual(user);
		});
	});

	describe('countUsersWhereEmailAndRule6Party', () => {
		it('should count users with given email and Rule 6 Party role', async () => {
			const email = 'test@example.com';
			const count = 1;
			mockPrismaClient.appealUser.count.mockResolvedValue(count);

			const result = await repository.countUsersWhereEmailAndRule6Party(email);

			expect(mockPrismaClient.appealUser.count).toHaveBeenCalledWith({
				where: {
					AND: [{ email }, { Appeals: { some: { role: APPEAL_USER_ROLES.RULE_6_PARTY } } }]
				}
			});
			expect(result).toEqual(count);
		});
	});

	describe('linkUserToAppeal', () => {
		it('should link user to appeal with given role', async () => {
			const userId = '1';
			const appealId = '1';
			const role = APPEAL_USER_ROLES.APPELLANT;
			const link = { appealId, userId, role };
			mockPrismaClient.appealToUser.findMany.mockResolvedValue([]);
			mockPrismaClient.appealToUser.create.mockResolvedValue(link);

			const result = await repository.linkUserToAppeal(userId, appealId, role);

			expect(mockPrismaClient.appealToUser.findMany).toHaveBeenCalledWith({
				where: { appealId, userId }
			});
			expect(mockPrismaClient.appealToUser.create).toHaveBeenCalledWith({ data: link });
			expect(result).toEqual(link);
		});

		it('should update existing role if different', async () => {
			const userId = '1';
			const appealId = '1';
			const role = APPEAL_USER_ROLES.AGENT;
			const existingRole = { id: '1', appealId, userId, role: APPEAL_USER_ROLES.APPELLANT };
			mockPrismaClient.appealToUser.findMany.mockResolvedValue([existingRole]);
			mockPrismaClient.appealToUser.update.mockResolvedValue({ ...existingRole, role });

			const result = await repository.linkUserToAppeal(userId, appealId, role);

			expect(mockPrismaClient.appealToUser.findMany).toHaveBeenCalledWith({
				where: { appealId, userId }
			});
			expect(mockPrismaClient.appealToUser.update).toHaveBeenCalledWith({
				where: { id: existingRole.id },
				data: { role }
			});
			expect(result).toEqual({ ...existingRole, role });
		});
	});
});
