const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');

const { isFeatureActive } = require('../../src/configuration/featureFlag');

const dbName = 'users';
let appealsApi;
let databaseConnection;
let testLpaEmail = 'appealplanningdecisiontest@planninginspectorate.gov.uk';
let testLpaDomain = 'planninginspectorate.gov.uk';
let testLpaONSCodeEngland = 'E69999999';
let testLpaCodeEngland = 'Q9999';
let testLpaONSCodeWales = 'W69999999';
let testLpaNameEngland = 'System Test Borough Council England';
let testLpaNameWales = 'System Test Borough Council Wales';
let testHorizonLpaCodeWales = 'H1234';

jest.setTimeout(120000); // The Horizon integration tests need a bit of time to complete! This seemed like a good number (2 mins)
jest.mock('../../src/db/db'); // TODO: We shouldn't need to do this, but we didn't have time to look at making this better. It should be possible to use the DB connection directly (not mock it)
jest.mock('../../src/configuration/featureFlag');

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE /////
	///////////////////////////////

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	let mockedDatabase = await databaseConnection.db(dbName);
	appDbConnection.get.mockReturnValue(mockedDatabase);

	/////////////////////
	///// SETUP APP /////
	/////////////////////

	let server = http.createServer(app);
	appealsApi = supertest(server);

	/////////////////////////
	///// POPULATE LPAS /////
	/////////////////////////

	const testLpaJson = `{OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED\n323;${testLpaONSCodeEngland};${testLpaCodeEngland};${testLpaNameEngland};${testLpaEmail};${testLpaDomain};TRUE\n324;${testLpaONSCodeWales};${testHorizonLpaCodeWales};${testLpaNameWales};${testLpaEmail};;TRUE}\nno-domain;no-domain;${testLpaNameEngland};${testLpaEmail};;TRUE\ndifferent-domain;different-domain;${testLpaNameEngland};${testLpaEmail};test.com;TRUE`;

	await appealsApi.post('/api/v1/local-planning-authorities').send(testLpaJson);
});

beforeEach(async () => {
	jest.clearAllMocks();
	await _clearDatabaseCollections();
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

afterAll(async () => {
	if (databaseConnection) {
		await databaseConnection.close();
	}
});

describe('Users', () => {
	it('should create user', async () => {
		// When a valid user object is posted to the users api
		const response = await _createUser(1, true, testLpaCodeEngland);
		const response2 = await _createUser(2, false, testLpaCodeEngland);

		// Then: It should return a status code of 201
		expect(response.status).toBe(201);
		expect(response2.status).toBe(201);

		// And: The back-end should contain 2 users for that lpa
		const users = await appealsApi.get(`/api/v1/users/?lpaCode=${testLpaCodeEngland}`);
		expect(users.body.length).toBe(2);
	});

	it.skip('should not create duplicate user', async () => {
		// skipped as unique indexes don't work in tests for now

		// Given an existing user
		await _createUser(1, false, testLpaCodeEngland);

		// When the same email is posted to the users api
		const response = await _createUser(1, false, testLpaCodeEngland);

		// Then: It should return a status code of 400
		expect(response.status).toBe(400);

		// And: The back-end should contain 1 user for that lpa
		const usersResponse = await appealsApi.get(`/api/v1/users/?lpaCode=${testLpaCodeEngland}`);
		expect(usersResponse.body.length).toBe(1);
	});

	it('should not create multiple admin users', async () => {
		// Given and existing admin user
		await _createUser(1, true, testLpaCodeEngland);

		// When another admin user is added to the same lpa
		const response2 = await _createUser(2, true, testLpaCodeEngland);

		// Then: the second should return a 400
		expect(response2.status).toBe(400);

		// And: The back-end should contain 1 user for that lpa
		const users = await appealsApi.get(`/api/v1/users/?lpaCode=${testLpaCodeEngland}`);
		expect(users.body.length).toBe(1);
	});

	it('should set isAdmin if not provided', async () => {
		// When: post user: isAdmin is not provided the system defaults to false
		const response = await _createUser(1, undefined, testLpaCodeEngland);

		// Then: It should return a status code of 201
		expect(response.status).toBe(201);

		// And: The back-end should contain 1 user for that lpa with isAdmin set to false
		const users = await appealsApi.get(`/api/v1/users/?lpaCode=${testLpaCodeEngland}`);
		expect(users.body.length).toBe(1);
		expect(users.body[0].isAdmin).toBe(false);
	});

	it('should return 404 if lpa does not exist', async () => {
		// When: Post user is called to a nonexistent lpa
		const response = await _createUser(1, true, 'invalid-lpa');

		// Then: It should return a status code of 400
		expect(response.status).toBe(404);

		// And: The back-end should contain 0 users for that lpa
		const users = await appealsApi.get(`/api/v1/users/?lpaCode=${testLpaCodeEngland}`);
		expect(users.body.length).toBe(0);
	});

	it('should return 404 if lpa does not have a domain', async () => {
		// When: post user is called for an lpa with no listed domain
		const response = await _createUser(1, true, 'no-domain');

		// Then: It should return a status code of 400
		expect(response.status).toBe(404);

		// And: The back-end should contain 0 users for that lpa
		const users = await appealsApi.get(`/api/v1/users/?lpaCode=no-domain`);
		expect(users.body.length).toBe(0);
	});

	it('should return 404 if lpa domain does not match user domain', async () => {
		// When: post user has an email with a different domain to the lpa they are added to
		const response = await _createUser(1, true, 'different-domain');

		// Then: It should return a status code of 404
		expect(response.status).toBe(404);

		// And: The back-end should not have that user
		const users = await appealsApi.get(`/api/v1/users/?lpaCode=different-domain`);
		expect(users.body.length).toBe(0);
	});

	it('should 404 with no lpa', async () => {
		// when get is called with no lpa
		const response = await appealsApi.get('/api/v1/users');

		// then a 400 is returned
		expect(response.status).toBe(400);
	});

	it('should sort by admin then email', async () => {
		// given multiple users in collection
		await _createUser(3, true, testLpaCodeEngland);
		await _createUser(2, false, testLpaCodeEngland);
		await _createUser(1, false, testLpaCodeEngland);
		await _createUser(4, false, testLpaONSCodeWales);

		// when calling get for the lpa they belong to
		const usersResponse = await appealsApi.get(`/api/v1/users/?lpaCode=${testLpaCodeEngland}`);

		// then only the users from that lpa are returned
		expect(usersResponse.body.length).toBe(3);

		// and they are ordered by admin then email
		expect(usersResponse.body[0].email).toBe('testuser3@planninginspectorate.gov.uk');
		expect(usersResponse.body[1].email).toBe('testuser1@planninginspectorate.gov.uk');
		expect(usersResponse.body[2].email).toBe('testuser2@planninginspectorate.gov.uk');
	});

	it('should return user', async () => {
		// given a user is added
		const email = 'testuser1@planninginspectorate.gov.uk';
		await _createUser(email, true, testLpaCodeEngland);

		// when getting that user
		const userResponse = await appealsApi.get(`/api/v1/users/${email}`);

		// then the user is returned
		expect(userResponse.body.email).toBe(email);
		expect(userResponse.body.isAdmin).toBe(true);
		expect(userResponse.body.enabled).toBe(true);
	});

	it('should 404 with nonexistent user', async () => {
		// when: getting a nonexistent user
		const user = await appealsApi.get(`/api/v1/users/testuser1@planninginspectorate.gov.uk`);

		// then: a 404 is returned
		expect(user.status).toBe(404);
	});

	it('can disable user and it is not returned by get actions', async () => {
		// given: a user exists
		const email = 'testuser1@planninginspectorate.gov.uk';
		await _createUser(email, false, testLpaCodeEngland);
		const userResponse = await appealsApi.get(`/api/v1/users/${email}`);

		// when: deleting that user
		await appealsApi.delete(`/api/v1/users/${userResponse.body._id}`);

		// then: the user is no longer returned in either get method
		const userResponse2 = await appealsApi.get(
			`/api/v1/users/testuser1@planninginspectorate.gov.uk`
		);
		const usersResponse = await appealsApi.get(`/api/v1/users/?lpaCode=${testLpaCodeEngland}`);

		expect(usersResponse.body.length).toBe(0);
		expect(userResponse2.status).toBe(400);
	});

	it("can't disable admin user", async () => {
		// given: user is admin
		const email = 'testuser1@planninginspectorate.gov.uk';
		await _createUser(email, true, testLpaCodeEngland);
		const userResponse = await appealsApi.get(`/api/v1/users/${email}`);

		// when: deleting
		const delResponse = await appealsApi.delete(`/api/v1/users/${userResponse.body._id}`);

		// then: it returns 400
		expect(delResponse.status).toBe(400);
	});
});

const _createUser = async (email, isAdmin, lpa) => {
	email += '';
	if (email.indexOf('@') === -1) {
		email = `testuser${email}@planninginspectorate.gov.uk`;
	}

	return await appealsApi.post('/api/v1/users').send({
		email: email,
		isAdmin: isAdmin,
		enabled: true,
		lpaCode: lpa
	});
};

/**
 * Clears out all collection from the database EXCEPT the LPA collection, since this is needed
 * from one test to the next, and its data does not change during any test execution.
 */
const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db(dbName).collections();
	const databaseCollectionsFiltered = databaseCollections.filter(
		(collection) => collection.namespace.split('.')[1] !== 'lpa'
	);

	for (const collection of databaseCollectionsFiltered) {
		await collection.drop();
	}
};