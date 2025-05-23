const { AppealUserRepository } = require('../../../src/repositories/sql/appeal-user-repository');
const { createPrismaClient } = require('../../../src/db/db-client');
const ApiError = require('../../../src/errors/apiError');

const TEST_EMAIL = 'test-user1@planninginspectorate.gov.uk';
const TEST_USER = {
	email: TEST_EMAIL,
	isEnrolled: true,
	isLpaUser: true,
	isLpaAdmin: true,
	lpaCode: 'Q9999',
	lpaStatus: 'confirmed'
};

let repo;
let dbClient;

jest.mock('../../../src/errors/apiError');

beforeAll(async () => {
	repo = new AppealUserRepository();
	const error = jest.fn().mockReturnValue(new Error('errorDuplicate'));
	ApiError.userDuplicate = error;
	dbClient = createPrismaClient();
});

beforeEach(() => {
	jest.clearAllMocks();
});

afterEach(async () => {
	await dbClient.appealUser.delete({
		where: {
			email: TEST_EMAIL
		}
	});
});

afterAll(async () => {
	await dbClient.$disconnect();
});

it('should create user with given details', async () => {
	const user = await repo.createUser(TEST_USER);

	delete user.id;
	expect(user).toEqual({
		...TEST_USER
	});
});

it('should throw error when trying to create user already in the database', async () => {
	await repo.createUser(TEST_USER);

	await expect(repo.createUser(TEST_USER)).rejects.toThrow(new Error('errorDuplicate'));
});

it('should get user with email', async () => {
	await repo.createUser(TEST_USER);
	const user = await repo.getByEmail(TEST_EMAIL);

	delete user.id;
	expect(user).toEqual({
		...TEST_USER
	});
});

it('should count number of users with rule 6 role by email', async () => {
	await repo.createUser(TEST_USER);
	const count = await repo.countUsersWhereEmailAndRule6Party(TEST_EMAIL);

	expect(count).toEqual(0);
});
