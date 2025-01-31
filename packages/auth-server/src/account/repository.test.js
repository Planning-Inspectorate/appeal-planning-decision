import AccountRepository from './repository.js';
import { jest } from '@jest/globals';

jest.mock('@prisma/client', () => ({
	Prisma: {}
}));

describe('AccountRepository', () => {
	let client;
	let logger;
	let repository;

	beforeEach(() => {
		client = {
			appealUser: {
				create: jest.fn(),
				update: jest.fn(),
				findUnique: jest.fn()
			}
		};
		logger = {
			error: jest.fn()
		};
		repository = new AccountRepository({ client, logger });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createUser', () => {
		it('should create a new user', async () => {
			const user = { email: 'test@example.com' };
			client.appealUser.create.mockResolvedValue(user);

			const result = await repository.createUser(user);

			expect(client.appealUser.create).toHaveBeenCalledWith({
				data: { ...user, email: 'test@example.com' }
			});
			expect(result).toBe(user);
		});

		it('should log and rethrow other errors', async () => {
			const user = { email: 'test@example.com' };
			const error = new Error('Test error');
			client.appealUser.create.mockRejectedValue(error);

			await expect(repository.createUser(user)).rejects.toThrow(error);
			expect(logger.error).toHaveBeenCalledWith(error);
		});
	});

	describe('updateUser', () => {
		it('should update an existing user', async () => {
			const user = { id: '1', email: 'test@example.com' };
			client.appealUser.update.mockResolvedValue(user);

			const result = await repository.updateUser(user);

			expect(client.appealUser.update).toHaveBeenCalledWith({
				data: { ...user, email: 'test@example.com' },
				where: { id: '1' }
			});
			expect(result).toBe(user);
		});

		it('should log and rethrow other errors', async () => {
			const user = { id: '1', email: 'test@example.com' };
			const error = new Error('Test error');
			client.appealUser.update.mockRejectedValue(error);

			await expect(repository.updateUser(user)).rejects.toThrow(error);
			expect(logger.error).toHaveBeenCalledWith(error);
		});
	});

	describe('getByEmail', () => {
		it('should get a user by email', async () => {
			const user = { email: 'test@example.com' };
			client.appealUser.findUnique.mockResolvedValue(user);

			const result = await repository.getByEmail('test@example.com');

			expect(client.appealUser.findUnique).toHaveBeenCalledWith({
				where: { email: 'test@example.com' }
			});
			expect(result).toBe(user);
		});
	});

	describe('getById', () => {
		it('should get a user by id', async () => {
			const user = { id: '1' };
			client.appealUser.findUnique.mockResolvedValue(user);

			const result = await repository.getById('1');

			expect(client.appealUser.findUnique).toHaveBeenCalledWith({
				where: { id: '1' }
			});
			expect(result).toBe(user);
		});
	});
});
