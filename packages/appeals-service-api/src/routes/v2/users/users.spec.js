const crypto = require('crypto');
const http = require('http');
const supertest = require('supertest');

const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

const { isFeatureActive } = require('../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');
jest.mock('../../../../src/services/object-store');

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
	await sqlClient.$disconnect();
});

describe('users v2', () => {
	describe('create user', () => {
		it('should return 400 if bad user data supplied', async () => {
			const response1 = await appealsApi.post('/api/v2/users').send({});
			const response2 = await appealsApi.post('/api/v2/users').send({
				id: '123',
				email: 'nope@example.com'
			});

			expect(response1.status).toEqual(400);
			expect(response2.status).toEqual(400);
		});

		it('should return 500 if unknown field supplied', async () => {
			const response = await appealsApi.post('/api/v2/users').send({
				email: 'nope@example.com',
				unknownField: '123'
			});

			expect(response.status).toBe(500);
		});

		it('should return 400 if duplicate user supplied', async () => {
			await appealsApi.post('/api/v2/users').send({
				email: 'test-duplicate@example.com'
			});

			const response = await appealsApi.post('/api/v2/users').send({
				email: 'test-duplicate@example.com'
			});

			expect(response.status).toEqual(400);
		});

		it('should create user', async () => {
			const response = await appealsApi.post('/api/v2/users').send({
				email: 'working-user-creation@example.com'
			});

			expect(response.status).toEqual(200);
			expect(response.body.email).toBe('working-user-creation@example.com');
			expect(response.body.isLpaUser).toBe(false);
			expect(response.body.isLpaAdmin).toBe(null);
			expect(response.body.lpaCode).toBe(null);
			expect(response.body.lpaStatus).toBe(null);
		});

		it('should create lpa user', async () => {
			const response = await appealsApi.post('/api/v2/users').send({
				email: 'working-lpa-creation@example.com',
				isLpaUser: true,
				lpaCode: 'Q9999'
			});

			expect(response.status).toEqual(200);
			expect(response.body.email).toBe('working-lpa-creation@example.com');
			expect(response.body.isLpaUser).toBe(true);
			expect(response.body.isLpaAdmin).toBe(false);
			expect(response.body.lpaCode).toBe('Q9999');
			expect(response.body.lpaStatus).toBe('added');
		});

		it('should reset the status of removed user to Added', async () => {
			const createResponse = await appealsApi.post('/api/v2/users').send({
				email: 'working-recreation@example.com',
				isLpaUser: true,
				lpaCode: 'Q9999'
			});
			expect(createResponse.status).toEqual(200);

			await appealsApi.delete(`/api/v2/users/working-recreation@example.com`).send();

			const recreateResponse = await appealsApi.post('/api/v2/users').send({
				email: 'working-recreation@example.com',
				isLpaUser: true,
				lpaCode: 'Q9999'
			});
			expect(recreateResponse.status).toEqual(200);

			expect(recreateResponse.body.email).toBe('working-recreation@example.com');
			expect(recreateResponse.body.isLpaUser).toBe(true);
			expect(recreateResponse.body.isLpaAdmin).toBe(false);
			expect(recreateResponse.body.lpaCode).toBe('Q9999');
			expect(recreateResponse.body.lpaStatus).toBe('added');
		});

		it('should throw 400 error if LPA tries to add the same account multiple times without removing first', async () => {
			const createResponse1 = await appealsApi.post('/api/v2/users').send({
				email: 'working-recreation-duplicate-creation@example.com',
				isLpaUser: true,
				lpaCode: 'Q9999'
			});
			expect(createResponse1.status).toEqual(200);
			const createResponse2 = await appealsApi.post('/api/v2/users').send({
				email: 'working-recreation-duplicate-creation@example.com',
				isLpaUser: true,
				lpaCode: 'Q9999'
			});
			expect(createResponse2.status).toEqual(400);
		});
	});

	describe('search users', () => {
		it('should not return all users', async () => {
			const response = await appealsApi.get('/api/v2/users');
			expect(response.status).toEqual(400);
		});

		it('should return lpa user list', async () => {
			await appealsApi.post('/api/v2/users').send({
				email: 'lpa-list@example.com',
				isLpaUser: true,
				lpaCode: 'Q9999'
			});
			const response = await appealsApi.get('/api/v2/users?lpaCode=Q9999');
			expect(response.status).toEqual(200);
			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body.some((user) => user.email === 'lpa-list@example.com')).toBe(true);
		});

		it('should return empty user list with wrong lpa code', async () => {
			const response = await appealsApi.get('/api/v2/users?lpaCode=abc');
			expect(response.status).toEqual(200);
			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body.length).toEqual(0);
		});

		it('should return only return active lpa users', async () => {
			await appealsApi.post('/api/v2/users').send({
				email: 'lpa-active1@example.com',
				isLpaUser: true,
				lpaCode: 'Q9999'
			});
			await appealsApi.post('/api/v2/users').send({
				email: 'lpa-inactive2@example.com',
				isLpaUser: true,
				lpaCode: 'Q9999'
			});
			await appealsApi.delete(`/api/v2/users/${'lpa-inactive2@example.com'}`).send();
			const response = await appealsApi.get('/api/v2/users?lpaCode=Q9999');
			expect(response.status).toEqual(200);
			expect(Array.isArray(response.body)).toBe(true);
			expect(
				response.body.some((x) => {
					return x.email === 'lpa-inactive2@example.com';
				})
			).toBe(false);
		});
	});

	describe('get user', () => {
		it('should 404 with unknown user', async () => {
			const response1 = await appealsApi.get('/api/v2/users/abc');
			const response2 = await appealsApi.get('/api/v2/users/abc@exmaple.com');
			expect(response1.status).toEqual(404);
			expect(response2.status).toEqual(404);
		});

		it('should 200 with email', async () => {
			const testEmail = 'user-get-email@example.com';
			await appealsApi.post('/api/v2/users').send({
				email: testEmail
			});
			const response = await appealsApi.get(`/api/v2/users/${testEmail}`);
			expect(response.status).toEqual(200);
			expect(response.body.email).toBe(testEmail);
		});

		it('should 200 with id', async () => {
			const createResponse = await appealsApi.post('/api/v2/users').send({
				email: 'user-get-id@example.com'
			});
			const response = await appealsApi.get(`/api/v2/users/${createResponse.body.id}`);
			expect(response.status).toEqual(200);
			expect(response.body.email).toBe('user-get-id@example.com');
		});
	});

	describe('update user', () => {
		it('should 404 with unknown user', async () => {
			const response = await appealsApi.patch('/api/v2/users/nope').send({
				data: 'change'
			});

			expect(response.status).toEqual(404);
		});

		it('should update with email', async () => {
			const testEmail = 'user-get-email1@example.com';
			await appealsApi.post('/api/v2/users').send({
				email: testEmail
			});

			const response = await appealsApi.patch(`/api/v2/users/${testEmail}`).send({
				isEnrolled: true
			});

			expect(response.status).toEqual(200);
			expect(response.body.isEnrolled).toEqual(true);
		});

		it('should update with id', async () => {
			const createUser = await appealsApi.post('/api/v2/users').send({
				email: 'user-get-email2@example.com'
			});
			const response = await appealsApi.patch(`/api/v2/users/${createUser.body.id}`).send({
				isEnrolled: true
			});

			expect(response.status).toEqual(200);
			expect(response.body.isEnrolled).toEqual(true);
		});

		it('should not update unexpected fields', async () => {
			const createUser = await appealsApi.post('/api/v2/users').send({
				email: 'user-get-email3@example.com'
			});
			const response = await appealsApi.patch(`/api/v2/users/${createUser.body.id}`).send({
				isLpaUser: true,
				unknownField: 1
			});

			expect(response.status).toEqual(200);
			expect(response.body.isLpaUser).toEqual(false);
			expect(response.body.unknownField).toEqual(undefined);
		});
	});

	describe('delete user', () => {
		it('should 400 with non lpa user', async () => {
			const email = 'delete-not-lpa@example.com';
			await appealsApi.post('/api/v2/users').send({
				email
			});

			const response = await appealsApi.delete(`/api/v2/users/${email}`).send();
			expect(response.status).toEqual(400);

			const user = await appealsApi.get(`/api/v2/users/${email}`).send();
			expect(user.status).toEqual(200);
			expect(user.body.lpaStatus).toBe(null);
		});

		it('should set removed status on lpa user', async () => {
			const email = 'delete-lpa@example.com';
			await appealsApi.post('/api/v2/users').send({
				email,
				isLpaUser: true,
				lpaCode: 'Q9999'
			});

			const response = await appealsApi.delete(`/api/v2/users/${email}`).send();
			expect(response.status).toEqual(200);

			const user = await appealsApi.get(`/api/v2/users/${email}`).send();
			expect(user.status).toBe(200);
			expect(user.body.lpaStatus).toBe('removed');
		});
	});

	describe('link user', () => {
		it('should return 400 if invalid role supplied', async () => {
			const testEmail = crypto.randomUUID() + '@example.com';
			await _createSqlUser(testEmail);
			const response = await appealsApi.post(`/api/v2/users/${testEmail}/appeal/123`).send({
				role: 'nope'
			});

			expect(response.status).toEqual(400);
			expect(response.body.errors[0]).toEqual('invalid role');
		});

		it('should return 404 if user not found', async () => {
			const response = await appealsApi.post('/api/v2/users/abc/appeal/123').send();
			expect(response.status).toEqual(404);
			expect(response.body.errors[0]).toEqual('The user was not found');
		});

		it('should return 404 if appeal not found', async () => {
			const testEmail = crypto.randomUUID() + '@example.com';
			await _createSqlUser(testEmail);

			const response = await appealsApi.post(`/api/v2/users/${testEmail}/appeal/123`).send();
			expect(response.status).toEqual(404);
			expect(response.body.errors[0]).toEqual(`The appeal 123 was not found`);
		});

		it('should default to appellant if no role supplied', async () => {
			const testEmail = crypto.randomUUID() + '@example.com';

			await _createSqlUser(testEmail);
			const appeal = await _createSqlAppeal();

			const response = await appealsApi
				.post(`/api/v2/users/${testEmail}/appeal/${appeal.id}`)
				.send();

			expect(response.status).toEqual(200);
			expect(response.body.role).toEqual(APPEAL_USER_ROLES.APPELLANT);
		});

		it('should use role supplied if valid', async () => {
			const testEmail = crypto.randomUUID() + '@example.com';

			await _createSqlUser(testEmail);
			const appeal = await _createSqlAppeal();

			const response = await appealsApi
				.post(`/api/v2/users/${testEmail}/appeal/${appeal.id}`)
				.send({
					role: APPEAL_USER_ROLES.AGENT
				});

			expect(response.status).toEqual(200);
			expect(response.body.role).toEqual(APPEAL_USER_ROLES.AGENT);
		});
	});

	describe('isRule6User', () => {
		it('should return false if user has no rule 6 roles', async () => {
			const testEmail = crypto.randomUUID() + '@example.com';
			await _createSqlUser(testEmail);
			const response = await appealsApi.get(`/api/v2/users/${testEmail}/isRule6User`);

			expect(response.status).toEqual(200);
			expect(response.body).toEqual(false);
		});

		it('should return true if user has any rule 6 roles', async () => {
			const testEmail = crypto.randomUUID() + '@example.com';
			await _createSqlUser(testEmail);
			const appeal = await _createSqlAppeal();
			await appealsApi.post(`/api/v2/users/${testEmail}/appeal/${appeal.id}`).send({
				role: APPEAL_USER_ROLES.RULE_6_PARTY
			});

			const response = await appealsApi.get(`/api/v2/users/${testEmail}/isRule6User`);

			expect(response.status).toEqual(200);
			expect(response.body).toEqual(true);
		});
	});
});

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
