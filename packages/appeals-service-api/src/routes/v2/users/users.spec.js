const http = require('http');
const supertest = require('supertest');

const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('../../../db/seed/data-static');

const { isFeatureActive } = require('../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');

const TEST_EMAIL = 'test-user1@example.com';

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE ////
	/////////////////////////////
	sqlClient = createPrismaClient();

	/////////////////////
	///// SETUP APP ////
	///////////////////
	let server = http.createServer(app);
	appealsApi = supertest(server);

	await seedStaticData(sqlClient);
});

beforeEach(async () => {
	// clear sql db
	await _clearSqlData();

	// turn all feature flags on
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

afterEach(async () => {
	jest.clearAllMocks();
});

afterAll(async () => {
	await sqlClient.$disconnect();
});

describe('users v2', () => {
	describe('link user', () => {
		it('should return 400 if invalid role supplied', async () => {
			const response = await appealsApi.post('/api/v2/users/abc/appeal/123').send({
				role: 'nope'
			});

			expect(response.status).toBe(400);
			expect(response.body.errors[0]).toEqual('invalid role');
		});

		it('should return 404 if user not found', async () => {
			const response = await appealsApi.post('/api/v2/users/abc/appeal/123').send();
			expect(response.status).toBe(404);
			expect(response.body.errors[0]).toEqual('The user was not found');
		});

		it('should return 404 if appeal not found', async () => {
			await _createSqlUser(TEST_EMAIL);

			const response = await appealsApi.post(`/api/v2/users/${TEST_EMAIL}/appeal/123`).send();
			expect(response.status).toBe(404);
			expect(response.body.errors[0]).toEqual(`The appeal 123 was not found`);
		});

		it('should default to appellant if no role supplied', async () => {
			await _createSqlUser(TEST_EMAIL);
			const appeal = await _createSqlAppeal();

			const response = await appealsApi
				.post(`/api/v2/users/${TEST_EMAIL}/appeal/${appeal.id}`)
				.send();

			expect(response.status).toBe(200);
			expect(response.body.role).toEqual('appellant');
		});

		it('should use role supplied if valid', async () => {
			await _createSqlUser(TEST_EMAIL);
			const appeal = await _createSqlAppeal();

			const response = await appealsApi
				.post(`/api/v2/users/${TEST_EMAIL}/appeal/${appeal.id}`)
				.send({
					role: 'agent'
				});

			expect(response.status).toBe(200);
			expect(response.body.role).toEqual('agent');
		});
	});
});

/**
 * @returns {Promise.<void>}
 */
const _clearSqlData = async () => {
	await sqlClient.securityToken.deleteMany();
	await sqlClient.appealToUser.deleteMany();
	await sqlClient.appealUser.deleteMany();
	await sqlClient.appealCase.deleteMany();
	await sqlClient.appeal.deleteMany();
};

/**
 * @param {string} email
 * @returns {Promise.<import('@prisma/client').AppealUser>}
 */
const _createSqlUser = async (email) => {
	return await sqlClient.appealUser.upsert({
		create: {
			email: email,
			isEnrolled: true
		},
		update: {
			isEnrolled: true
		},
		where: { email: email }
	});
};

/**
 * @returns {Promise.<import('@prisma/client').Appeal>}
 */
const _createSqlAppeal = async () => {
	return await sqlClient.appeal.create({});
};
