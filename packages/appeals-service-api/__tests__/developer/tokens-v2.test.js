const crypto = require('crypto');
const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const container = require('rhea');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');
const appConfiguration = require('../../src/configuration/config');
const { createPrismaClient } = require('../../src/db/db-client');

const MockedExternalApis = require('./external-dependencies/rest-apis/mocked-external-apis');
// const NotifyInteraction = require('../external-dependencies/rest-apis/interactions/notify-interaction');
const AppealFixtures = require('./fixtures/appeals');

const { isFeatureActive } = require('../../src/configuration/featureFlag');
const enterCodeConfig = require('@pins/common/src/enter-code-config');
const { MILLISECONDS_BETWEEN_TOKENS } = require('../../src/routes/v2/token/controller');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;
/** @type {import('mongodb').MongoClient} */
let databaseConnection;
/** @type {import('./external-dependencies/rest-apis/mocked-external-apis')} */
let mockedExternalApis;
// /** @type {Array.<*>} */
// let expectedNotifyInteractions;

jest.setTimeout(140000);
jest.mock('../../src/db/db');
jest.mock('../../src/configuration/featureFlag');

let TEST_APPEAL;
/** @type {import('@prisma/client').AppealUser} */
let TEST_USER;

/** @type {Array.<string>} */
const userIds = [];
/** @type {Array.<string>} */
const appealIds = [];

beforeAll(async () => {
	///////////////////////////////
	///// SETUP EXTERNAL APIs ////
	/////////////////////////////

	mockedExternalApis = await MockedExternalApis.setup();

	///////////////////////////////
	///// SETUP TEST DATABASE ////
	/////////////////////////////
	if (!process.env.INTEGRATION_TEST_DB_URL) {
		throw new Error('process.env.INTEGRATION_TEST_DB_URL not set');
	}

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	let mockedDatabase = await databaseConnection.db('integration-test-tokens-db');
	appDbConnection.get.mockReturnValue(mockedDatabase);

	const test_listener = container.create_container();

	test_listener.on('disconnected', (context) => {
		context.connection.close();
	});

	// sql client
	sqlClient = createPrismaClient();

	/////////////////////////////
	///// SETUP TEST CONFIG ////
	///////////////////////////

	appConfiguration.services.notify.apiKey = 'abc';
	appConfiguration.services.notify.serviceId = '123';
	appConfiguration.services.notify.baseUrl = mockedExternalApis.getNotifyUrl();
	appConfiguration.services.notify.templates.LPA_DASHBOARD.enterCodeIntoServiceEmailToLPA = '1';
	appConfiguration.services.notify.templates.SAVE_AND_RETURN.enterCodeIntoServiceEmailToAppellant =
		'2';
	appConfiguration.services.notify.templates.APPELLANT_LOGIN.confirmRegistrationEmailToAppellant =
		'3';

	/////////////////////
	///// SETUP APP ////
	///////////////////

	let server = http.createServer(app);
	appealsApi = supertest(server);

	////////////////////////////
	///// Add static data /////
	//////////////////////////
	const { appealResponse, userResponse } = await _createAppeal();
	TEST_APPEAL = appealResponse.body;
	TEST_USER = userResponse;
});

beforeEach(async () => {
	await mockedExternalApis.clearAllMockedResponsesAndRecordedInteractions();
	jest.clearAllMocks();
	await sqlClient.securityToken.deleteMany({
		where: {
			appealUserId: {
				in: userIds
			}
		}
	});

	await mockedExternalApis.mockNotifyResponse({}, 200);

	// clear expected api calls
	// expectedNotifyInteractions = [];

	// turn all feature flags on
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

afterEach(async () => {
	// runs expect calls so may exit early
	// await mockedExternalApis.checkInteractions(expectedNotifyInteractions);
});

afterAll(async () => {
	await _clearSqlData();

	// close db connections
	await sqlClient.$disconnect();
	await databaseConnection.close();

	// teardown mock containers
	await mockedExternalApis.teardown();
});

describe('tokens v2', () => {
	describe('put', () => {
		it('should create new appeal user and token from appeal id', async () => {
			const tokenResponse = await appealsApi.put('/api/v2/token').send({
				id: TEST_APPEAL.id,
				action: enterCodeConfig.actions.confirmEmail
			});

			expect(tokenResponse.status).toBe(200);

			const appealUser = await sqlClient.appealUser.findFirstOrThrow({
				where: {
					email: TEST_USER.email
				}
			});
			const securityToken = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: appealUser?.id
				}
			});

			expect(appealUser.email).toEqual(TEST_APPEAL.email);
			expect(appealUser.isEnrolled).toEqual(false);
			expect(securityToken.appealUserId).toBeDefined();

			// check email sent
			// const emailToLpaInteraction = NotifyInteraction.getCodeSentInteraction();
			// expectedNotifyInteractions = [emailToLpaInteraction];
		});

		it('should avoid sending multiple tokens in quick succession', async () => {
			const tokenResponse = await appealsApi.put('/api/v2/token').send({
				id: TEST_APPEAL.id,
				action: enterCodeConfig.actions.saveAndReturn
			});
			const securityToken = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: TEST_USER.id
				}
			});

			const tokenResponse2 = await appealsApi.put('/api/v2/token').send({
				id: TEST_APPEAL.id,
				action: enterCodeConfig.actions.saveAndReturn
			});
			const securityToken2 = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: TEST_USER.id
				}
			});

			await new Promise((resolve) => {
				setTimeout(resolve, MILLISECONDS_BETWEEN_TOKENS);
			});

			const tokenResponse3 = await appealsApi.put('/api/v2/token').send({
				id: TEST_APPEAL.id,
				action: enterCodeConfig.actions.saveAndReturn
			});
			const securityToken3 = await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: TEST_USER.id
				}
			});

			expect(tokenResponse.status).toBe(200);
			expect(tokenResponse2.status).toBe(200);
			expect(tokenResponse3.status).toBe(200);
			expect(securityToken).toEqual(securityToken2);
			expect(securityToken).not.toEqual(securityToken3);
		});

		it('should create token for existing user from appeal id', async () => {
			const tokenResponse = await appealsApi.put('/api/v2/token').send({
				id: TEST_APPEAL.id,
				action: enterCodeConfig.actions.confirmEmail
			});

			expect(tokenResponse.status).toBe(200);

			await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: TEST_USER.id
				}
			});
		});

		it('should error if appeal id not found', async () => {
			const tokenResponse = await appealsApi.put('/api/v2/token').send({
				id: 'abc',
				action: enterCodeConfig.actions.confirmEmail
			});

			expect(tokenResponse.status).toBe(404);
			expect(tokenResponse.body.errors[0]).toEqual('The appeal abc was not found');
		});

		it('should create token for existing email user', async () => {
			const tokenResponse = await appealsApi.put('/api/v2/token').send({
				emailAddress: TEST_USER.email,
				action: enterCodeConfig.actions.confirmEmail
			});

			expect(tokenResponse.status).toBe(200);

			await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: TEST_USER.id
				}
			});
		});

		it('should create lpa token for existing email user', async () => {
			const tokenResponse = await appealsApi.put('/api/v2/token').send({
				emailAddress: TEST_USER.email,
				action: enterCodeConfig.actions.lpaDashboard
			});

			expect(tokenResponse.status).toBe(200);

			await sqlClient.securityToken.findFirstOrThrow({
				where: {
					appealUserId: TEST_USER.id
				}
			});
		});

		it('should error if email not found', async () => {
			const tokenResponse = await appealsApi.put('/api/v2/token').send({
				emailAddress: 'abc',
				action: enterCodeConfig.actions.confirmEmail
			});

			expect(tokenResponse.status).toBe(404);
			expect(tokenResponse.body.errors[0]).toEqual('The user was not found');
		});
	});

	// describe('post', () => {
	// 	const invalidTokenResponseBody = {
	// 		code: 400,
	// 		errors: ['Invalid Token']
	// 	};
	// 	it('should check token by appeal id', async () => {
	// 		let appealUser = await _createSqlUser(TEST_USER.email);

	// 		await appealsApi.put('/api/v2/token').send({
	// 			id: TEST_APPEAL.id,
	// 			action: enterCodeConfig.actions.confirmEmail
	// 		});

	// 		const securityToken = await sqlClient.securityToken.findFirst({
	// 			where: {
	// 				appealUserId: TEST_USER.id
	// 			}
	// 		});

	// 		const tokenResponse = await appealsApi.post('/api/v2/token').send({
	// 			id: TEST_APPEAL.id,
	// 			token: securityToken.token
	// 		});
	// 		appealUser = await sqlClient.appealUser.findFirstOrThrow({
	// 			where: {
	// 				id: TEST_USER.id
	// 			}
	// 		});

	// 		expect(tokenResponse.status).toBe(200);
	// 		expect(appealUser.isEnrolled).toEqual(true);
	// 		expect(tokenResponse.body).toEqual(
	// 			expect.objectContaining({
	// 				id: TEST_APPEAL.id,
	// 				action: enterCodeConfig.actions.confirmEmail,
	// 				createdAt: expect.any(String)
	// 			})
	// 		);
	// 	});

	// 	it('should fail token by appeal id', async () => {
	// 		let appealUser = await _createSqlUser(TEST_USER.email);

	// 		await appealsApi.put('/api/v2/token').send({
	// 			id: TEST_APPEAL.id,
	// 			action: enterCodeConfig.actions.confirmEmail
	// 		});

	// 		const tokenResponse = await appealsApi.post('/api/v2/token').send({
	// 			id: TEST_APPEAL.id,
	// 			token: 'nope'
	// 		});
	// 		appealUser = await sqlClient.appealUser.findFirstOrThrow({
	// 			where: {
	// 				id: TEST_USER.id
	// 			}
	// 		});

	// 		expect(tokenResponse.status).toBe(400);
	// 		expect(appealUser.isEnrolled).toEqual(false);
	// 		expect(tokenResponse.body).toEqual(invalidTokenResponseBody);
	// 	});

	// 	it('should check token by email', async () => {
	// 		let appealUser = await _createSqlUser(TEST_USER.email);

	// 		await appealsApi.put('/api/v2/token').send({
	// 			emailAddress: TEST_USER.email,
	// 			action: enterCodeConfig.actions.confirmEmail
	// 		});

	// 		const securityToken = await sqlClient.securityToken.findFirstOrThrow({
	// 			where: {
	// 				appealUserId: TEST_USER.id
	// 			}
	// 		});

	// 		const tokenResponse = await appealsApi.post('/api/v2/token').send({
	// 			emailAddress: TEST_USER.email,
	// 			token: securityToken.token
	// 		});

	// 		appealUser = await sqlClient.appealUser.findFirstOrThrow({
	// 			where: {
	// 				id: TEST_USER.id
	// 			}
	// 		});
	// 		expect(tokenResponse.status).toBe(200);
	// 		expect(appealUser.isEnrolled).toEqual(true);
	// 		expect(tokenResponse.body).toEqual(
	// 			expect.objectContaining({
	// 				action: enterCodeConfig.actions.confirmEmail,
	// 				createdAt: expect.any(String)
	// 			})
	// 		);
	// 	});

	// 	it('should fail token by email', async () => {
	// 		let appealUser = await _createSqlUser(TEST_USER.email);

	// 		await appealsApi.put('/api/v2/token').send({
	// 			emailAddress: appealUser.email,
	// 			action: enterCodeConfig.actions.confirmEmail
	// 		});

	// 		const tokenResponse = await appealsApi.post('/api/v2/token').send({
	// 			emailAddress: appealUser.email,
	// 			token: 'nope'
	// 		});

	// 		appealUser = await sqlClient.appealUser.findFirstOrThrow({
	// 			where: {
	// 				id: TEST_USER.id
	// 			}
	// 		});
	// 		expect(tokenResponse.status).toBe(400);
	// 		expect(appealUser.isEnrolled).toEqual(false);
	// 		expect(tokenResponse.body).toEqual(invalidTokenResponseBody);
	// 	});

	// 	it('should 429 for too many attempts', async () => {
	// 		await appealsApi.put('/api/v2/token').send({
	// 			id: TEST_APPEAL.id,
	// 			action: enterCodeConfig.actions.confirmEmail
	// 		});

	// 		const tokenResponse1 = await appealsApi.post('/api/v2/token').send({
	// 			id: TEST_APPEAL.id,
	// 			token: 'nope'
	// 		});
	// 		const tokenResponse2 = await appealsApi.post('/api/v2/token').send({
	// 			id: TEST_APPEAL.id,
	// 			token: 'nope'
	// 		});
	// 		const tokenResponse3 = await appealsApi.post('/api/v2/token').send({
	// 			id: TEST_APPEAL.id,
	// 			token: 'nope'
	// 		});
	// 		const tokenResponse4 = await appealsApi.post('/api/v2/token').send({
	// 			id: TEST_APPEAL.id,
	// 			token: 'nope'
	// 		});
	// 		const securityToken = await sqlClient.securityToken.findFirstOrThrow({
	// 			where: {
	// 				appealUserId: TEST_USER.id
	// 			}
	// 		});

	// 		// 4th attempt should 429
	// 		expect(securityToken.attempts).toEqual(4);
	// 		expect(tokenResponse1.status).toBe(400);
	// 		expect(tokenResponse2.status).toBe(400);
	// 		expect(tokenResponse3.status).toBe(400);
	// 		expect(tokenResponse4.status).toBe(429);
	// 		expect(tokenResponse1.body).toEqual(invalidTokenResponseBody);
	// 		expect(tokenResponse4.body).toEqual({});

	// 		// check subsequent attempts have the same result
	// 		const tokenResponse5 = await appealsApi.post('/api/v2/token').send({
	// 			id: TEST_APPEAL.id,
	// 			token: securityToken.token
	// 		});
	// 		expect(tokenResponse5.status).toBe(429);
	// 		expect(tokenResponse5.body).toEqual({});
	// 	});

	// 	it('should 404 for non existant appeal token', async () => {
	// 		const tokenResponse = await appealsApi.post('/api/v2/token').send({
	// 			id: 'abc',
	// 			token: 'nope'
	// 		});

	// 		expect(tokenResponse.status).toBe(404);
	// 		expect(tokenResponse.body.errors[0]).toEqual('The appeal abc was not found');
	// 	});

	// 	it('should 404 for non existant email token', async () => {
	// 		const tokenResponse = await appealsApi.post('/api/v2/token').send({
	// 			emailAddress: 'email',
	// 			token: 'nope'
	// 		});

	// 		expect(tokenResponse.status).toBe(404);
	// 		expect(tokenResponse.body.errors[0]).toEqual('The user was not found');
	// 	});
	// });
});

/**
 * @returns {Promise.<void>}
 */
const _clearSqlData = async () => {
	const testUsersClause = {
		in: userIds
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

const _createAppeal = async (appeal = AppealFixtures.newHouseholderAppeal()) => {
	appeal.email = crypto.randomUUID() + appeal.email;

	const appealCreatedResponse = await appealsApi.post('/api/v1/appeals');
	const appealCreated = appealCreatedResponse.body;

	appealIds.push(appealCreated.appealSqlId);

	const user = await _createSqlUser(appeal.email);

	appeal.id = appealCreated.id;
	const savedAppealResponse = await appealsApi
		.put(`/api/v1/appeals/${appealCreated.id}`)
		.send(appeal);

	return { appealResponse: savedAppealResponse, userResponse: user };
};

/**
 *
 * @param {string} email
 * @returns {Promise.<import('@prisma/client').AppealUser>}
 */
const _createSqlUser = async (email) => {
	const user = await sqlClient.appealUser.upsert({
		create: {
			email: email,
			isEnrolled: false
		},
		update: {
			isEnrolled: false
		},
		where: { email: email }
	});

	userIds.push(user.id);

	return user;
};
