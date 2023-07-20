const {
	getUsers,
	createUser,
	getUserByEmail,
	getUserById,
	disableUser,
	setUserStatus,
	addLPAUserNotify
} = require('../../../src/services/user.service');
const logger = require('../../../src/lib/logger');
const mongodb = require('../../../src/db/db');
const { STATUS_CONSTANTS } = require('@pins/common/src/constants');
const ObjectId = require('mongodb').ObjectId;
const ApiError = require('../../../src/errors/apiError');
const { sendLPADashboardInviteEmail } = require('../../../src/lib/notify');

jest.mock('../../../src/services/lpa.service');
jest.mock('../../../src/errors/apiError');
jest.mock('../../../src/lib/logger');

jest.mock('../../../src/lib/notify');

describe('src/services/user.service', () => {
	// Mock MongoDB collection and methods
	const collectionMock = {
		find: jest.fn(),
		findOne: jest.fn(),
		findOneAndUpdate: jest.fn(),
		insertOne: jest.fn(),
		countDocuments: jest.fn()
	};

	beforeEach(() => {
		// Reset mock functions before each test
		jest.clearAllMocks();

		// Mock MongoDB connection and collection
		mongodb.get = jest.fn(() => ({
			collection: jest.fn(() => collectionMock)
		}));
	});

	describe('getUsers', () => {
		it('should throw an error if lpaCode is not provided', async () => {
			try {
				await getUsers();
			} catch (err) {
				expect(err).toEqual(ApiError.noLpaCodeProvided());
			}
		});

		it('should handle errors by logging and re-throwing', async () => {
			const lpaCode = 'ABC123';
			const error = new Error('Database error');
			collectionMock.find.mockRejectedValue(error);

			await expect(getUsers(lpaCode)).rejects.toThrow(error);
			expect(collectionMock.find).toHaveBeenCalledWith({
				lpaCode: lpaCode,
				status: STATUS_CONSTANTS.CONFIRMED
			});
			expect(logger.error).toHaveBeenCalledWith(error);
		});

		it('should fetch users from the database and return the sorted result', async () => {
			const lpaCode = 'ABC123';
			const user1 = {
				_id: 'user1Id',
				email: 'user1@example.com',
				lpaCode: lpaCode,
				isAdmin: false,
				confirmedAt: new Date(2020, 1, 1)
			};
			const user2 = {
				_id: 'user2Id',
				email: 'user2@example.com',
				lpaCode: lpaCode,
				isAdmin: true,
				confirmedAt: new Date(2021, 2, 2)
			};
			const user3 = {
				_id: 'user3Id',
				email: 'user3@example.com',
				lpaCode: lpaCode,
				isAdmin: false,
				confirmedAt: new Date(2021, 1, 2)
			};
			const user4 = {
				_id: 'user3Id',
				email: 'user3@example.com',
				lpaCode: lpaCode,
				isAdmin: false,
				confirmedAt: new Date(2021, 1, 1)
			};
			const dbResult = {
				forEach: jest.fn((callback) => {
					callback(user1);
					callback(user2);
					callback(user3);
					callback(user4);
				})
			};

			collectionMock.find.mockResolvedValue(dbResult);

			const result = await getUsers(lpaCode);

			expect(collectionMock.find).toHaveBeenCalledWith({
				lpaCode: lpaCode,
				status: STATUS_CONSTANTS.CONFIRMED
			});
			expect(result).toEqual([user2, user3, user4, user1]); // Sorted by confirmedAt
		});
	});

	describe('createUser', () => {
		it('should throw an error if user or required properties are missing', async () => {
			try {
				const invalidUser = {};
				await createUser(invalidUser);
			} catch (err) {
				expect(err).toEqual(ApiError.badRequest());
			}

			try {
				const userWithoutLpaCode = { email: 'user@example.com' };
				await createUser(userWithoutLpaCode);
			} catch (err) {
				expect(err).toEqual(ApiError.badRequest());
			}

			try {
				const userWithoutEmail = { lpaCode: 'ABC123' };
				await createUser(userWithoutEmail);
			} catch (err) {
				expect(err).toEqual(ApiError.badRequest());
			}
		});

		it('should throw an error if an admin user already exists for the same lpaCode', async () => {
			const user = 1;

			collectionMock.countDocuments.mockResolvedValue(user);

			try {
				await createUser(user);
			} catch (err) {
				expect(err).toEqual(ApiError.userOnly1Admin());
			}
		});

		it.skip('should throw an error if the user email does not match the lpa domain', async () => {
			const user = {
				lpaCode: 'ABC123',
				email: 'user@example.com',
				isAdmin: false
			};

			// todo: how to mock lpa service class

			try {
				await createUser(user);
			} catch (err) {
				expect(err).toEqual(ApiError.userBadLpa());
			}
		});

		it.skip('should create a new user in the database', async () => {
			const user = {
				_id: 'newUserId',
				lpaCode: 'ABC123',
				email: 'user@example.com',
				isAdmin: false
			};

			// todo: how to mock lpa service class

			await createUser(user);

			expect(collectionMock.insertOne).toHaveBeenCalledWith(user);
		});

		it.skip('should handle errors by logging and throwing the appropriate ApiError', async () => {
			const user = {
				_id: 'newUserId',
				lpaCode: 'ABC123',
				email: 'user@example.com',
				isAdmin: false
			};
			const error = new Error('Database error');

			// todo: how to mock lpa service class

			try {
				await createUser(user);
			} catch (err) {
				expect(err).toEqual(error);
			}

			expect(collectionMock.insertOne).toHaveBeenCalledWith(user);
		});
	});

	describe('getUserByEmail', () => {
		it('should throw an error if the user is not found', async () => {
			const email = 'user@example.com';
			collectionMock.findOne.mockResolvedValue(null);
			try {
				await getUserByEmail(email);
			} catch (err) {
				expect(err).toEqual(ApiError.userNotFound());
			}
			expect(collectionMock.findOne).toHaveBeenCalledWith({ email: email }, expect.any(Object));
		});

		it('should throw an error if the user is disabled', async () => {
			const email = 'user@example.com';
			const disabledUser = { status: STATUS_CONSTANTS.REMOVED };
			collectionMock.findOne.mockResolvedValue(disabledUser);
			try {
				await getUserByEmail(email);
			} catch (err) {
				expect(err).toEqual(ApiError.userDisabled());
			}
			expect(collectionMock.findOne).toHaveBeenCalledWith({ email: email }, expect.any(Object));
		});

		it('should fetch the user from the database and return the result', async () => {
			const email = 'user@example.com';
			const user = {
				_id: 'userId',
				email: email,
				lpaCode: 'ABC123',
				isAdmin: false
			};
			collectionMock.findOne.mockResolvedValue(user);

			const result = await getUserByEmail(email);

			expect(collectionMock.findOne).toHaveBeenCalledWith({ email: email }, expect.any(Object));
			expect(result).toEqual(user);
		});

		it('should handle errors by logging and throwing', async () => {
			const email = 'user@example.com';
			const error = new Error('Database error');
			collectionMock.findOne.mockRejectedValue(error);
			try {
				await getUserByEmail(email);
			} catch (err) {
				expect(err).toEqual(error);
			}
			expect(collectionMock.findOne).toHaveBeenCalledWith({ email: email }, expect.any(Object));
		});
	});

	describe('getUserById', () => {
		it('should throw an error if the user is not found', async () => {
			const userId = '111111111111111111111111';
			collectionMock.findOne.mockResolvedValue(null);

			try {
				await getUserById(userId);
			} catch (err) {
				expect(err).toEqual(ApiError.userNotFound());
			}
			expect(collectionMock.findOne).toHaveBeenCalledWith(
				{ _id: new ObjectId(userId) },
				expect.any(Object)
			);
		});

		it('should fetch the user from the database and return the result', async () => {
			const userId = '111111111111111111111111';
			const user = {
				_id: userId,
				email: 'user@example.com',
				lpaCode: 'ABC123',
				isAdmin: false
			};
			collectionMock.findOne.mockResolvedValue(user);

			const result = await getUserById(userId);

			expect(collectionMock.findOne).toHaveBeenCalledWith(
				{ _id: new ObjectId(userId) },
				expect.any(Object)
			);
			expect(result).toEqual(user);
		});

		it('should handle errors by logging and throwing', async () => {
			const userId = '111111111111111111111111';
			const error = new Error('Database error');
			collectionMock.findOne.mockRejectedValue(error);

			try {
				await getUserById(userId);
			} catch (err) {
				expect(err).toEqual(error);
			}

			expect(collectionMock.findOne).toHaveBeenCalledWith(
				{ _id: new ObjectId(userId) },
				expect.any(Object)
			);
		});
	});

	describe('disableUser', () => {
		it('should throw an error if the user is an admin', async () => {
			const userId = '111111111111111111111111';
			const adminUser = { isAdmin: true };
			collectionMock.findOne.mockResolvedValue(adminUser);

			try {
				await disableUser(userId);
			} catch (err) {
				expect(err).toEqual(ApiError.userCantDisableAdmin());
			}
		});

		it('should disable the user in the database', async () => {
			const userId = '111111111111111111111111';
			const user = { isAdmin: false };
			collectionMock.findOne.mockResolvedValue(user);

			collectionMock.findOneAndUpdate.mockResolvedValue({ _id: userId });

			await disableUser(userId);

			expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
				{ _id: new ObjectId(userId) },
				{ $set: { status: STATUS_CONSTANTS.REMOVED } },
				{ returnDocument: 'after' }
			);
		});

		it('should handle errors by logging and throwing', async () => {
			const userId = '111111111111111111111111';
			const user = { isAdmin: false };
			const error = new Error('Database error');

			collectionMock.findOne.mockResolvedValue(user);
			collectionMock.findOneAndUpdate.mockRejectedValue(error);

			try {
				await disableUser(userId);
			} catch (err) {
				expect(err).toEqual(error);
			}
		});
	});

	describe('setUserStatus', () => {
		it("should update a user's status", async () => {
			collectionMock.findOneAndUpdate.mockResolvedValue({ _id: 1 });
			await setUserStatus(1, STATUS_CONSTANTS.ADDED);
			expect(logger.info).toHaveBeenNthCalledWith(1, 'attempting to set user status: 1');
			expect(logger.info).toHaveBeenNthCalledWith(2, 'set user status: 1');
		});

		it('should throw an error if it fails to update user', async () => {
			mongodb.get().collection().findOneAndUpdate.mockRejectedValue(new Error('Some mongo error'));
			try {
				await setUserStatus(1, STATUS_CONSTANTS.ADDED);
			} catch (e) {
				expect(logger.error).toHaveBeenCalled();
			}
		});
	});

	describe('addLPAUserNotify', () => {
		it('calls the sendLPADashbiardInviteEmail function', async () => {
			const mockUser = {
				email: 'test@example.com',
				isAdmin: false,
				enabled: true,
				lpaCode: 'Q9999'
			};

			await addLPAUserNotify(mockUser);

			expect(sendLPADashboardInviteEmail).toHaveBeenCalledWith(mockUser);
		});
	});
});
