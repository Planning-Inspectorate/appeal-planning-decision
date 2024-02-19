const crypto = require('crypto');
const http = require('http');
const supertest = require('supertest');

const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');

const { isFeatureActive } = require('../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');

jest.setTimeout(140000);

/** @type {Array.<string>} */
const usersIds = [];
/** @type {Array.<string>} */
const appealIds = [];

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
	// turn all feature flags on
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

afterEach(async () => {
	jest.clearAllMocks();
});

afterAll(async () => {
	// clear sql db
	await _clearSqlData();
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
			const testEmail = crypto.randomUUID() + '@example.com';
			await _createSqlUser(testEmail);

			const response = await appealsApi.post(`/api/v2/users/${testEmail}/appeal/123`).send();
			expect(response.status).toBe(404);
			expect(response.body.errors[0]).toEqual(`The appeal 123 was not found`);
		});

		it('should default to appellant if no role supplied', async () => {
			const testEmail = crypto.randomUUID() + '@example.com';

			await _createSqlUser(testEmail);
			const appeal = await _createSqlAppeal();

			const response = await appealsApi
				.post(`/api/v2/users/${testEmail}/appeal/${appeal.id}`)
				.send();

			expect(response.status).toBe(200);
			expect(response.body.role).toEqual('appellant');
		});

		it('should use role supplied if valid', async () => {
			const testEmail = crypto.randomUUID() + '@example.com';

			await _createSqlUser(testEmail);
			const appeal = await _createSqlAppeal();

			const response = await appealsApi
				.post(`/api/v2/users/${testEmail}/appeal/${appeal.id}`)
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
	const testUsersClause = {
		in: usersIds
	};
	const testAppealsClause = {
		in: appealIds
	};

	await sqlClient.securityToken.deleteMany({
		where: {
			appealUserId: testUsersClause
		}
	});

	await sqlClient.appealToUser.deleteMany({
		where: {
			userId: testUsersClause
		}
	});

	await sqlClient.appealUser.deleteMany({
		where: {
			id: testUsersClause
		}
	});

	await sqlClient.appeal.deleteMany({
		where: {
			id: testAppealsClause
		}
	});
};

/**
 * @param {string} email
 * @returns {Promise.<import('@prisma/client').AppealUser>}
 */
const _createSqlUser = async (email) => {
	const user = await sqlClient.appealUser.upsert({
		create: {
			email: email,
			isEnrolled: true
		},
		update: {
			isEnrolled: true
		},
		where: { email: email }
	});

	usersIds.push(user.id);

	return user;
};

/**
 * @returns {Promise.<import('@prisma/client').Appeal>}
 */
const _createSqlAppeal = async () => {
	const appeal = await sqlClient.appeal.create({});

	appealIds.push(appeal.id);

	return appeal;
};
