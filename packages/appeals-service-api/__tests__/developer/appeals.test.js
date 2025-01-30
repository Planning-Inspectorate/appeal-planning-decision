const crypto = require('crypto');
const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const container = require('rhea');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');
const appConfiguration = require('../../src/configuration/config');
const { createPrismaClient } = require('../../src/db/db-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

const MockedExternalApis = require('./external-dependencies/rest-apis/mocked-external-apis');
const AppealFixtures = require('./fixtures/appeals');

const { isFeatureActive } = require('../../src/configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;
/** @type {import('mongodb').MongoClient} */
let databaseConnection;
/** @type {import('./external-dependencies/rest-apis/mocked-external-apis')} */
let mockedExternalApis;
/** @type {Array.<*>} */
let expectedNotifyInteractions;
let testLpaEmail = 'appealplanningdecisiontest@planninginspectorate.gov.uk';
let testLpaCodeEngland = 'E69999999';
let testLpaCodeWales = 'W69999999';
let testLpaNameEngland = 'System Test Borough Council England';
let testLpaNameWales = 'System Test Borough Council Wales';
let testHorizonLpaCodeWales = 'H1234';

jest.setTimeout(240000); // The Horizon integration tests need a bit of time to complete! This seemed like a good number (4 mins)
jest.mock('../../src/db/db'); // TODO: We shouldn't need to do this, but we didn't have time to look at making this better. It should be possible to use the DB connection directly (not mock it)
jest.mock('../../src/configuration/featureFlag');
jest.mock('../../src/services/object-store');

const dbName = 'integration-test-appeals-db';

/** @type {Array.<string>} */
const userIds = [];
/** @type {Array.<string>} */
const appealIds = [];

beforeAll(async () => {
	///////////////////////////////
	///// SETUP EXTERNAL APIs /////
	///////////////////////////////

	mockedExternalApis = await MockedExternalApis.setup();

	///////////////////////////////
	///// SETUP TEST DATABASE /////
	///////////////////////////////
	if (!process.env.INTEGRATION_TEST_DB_URL) {
		throw new Error('process.env.INTEGRATION_TEST_DB_URL not set');
	}

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	let mockedDatabase = await databaseConnection.db(dbName);
	appDbConnection.get.mockReturnValue(mockedDatabase);

	const test_listener = container.create_container();

	test_listener.on('disconnected', (context) => {
		context.connection.close();
	});

	// sql client
	sqlClient = createPrismaClient();

	/////////////////////////////
	///// SETUP TEST CONFIG /////
	/////////////////////////////
	appConfiguration.services.notify.apiKey =
		'hasserviceapikey-u89q754j-s87j-1n35-s351-789245as890k-1545v789-8s79-0124-qwe7-j2vfds34w5nm';
	appConfiguration.services.notify.baseUrl = mockedExternalApis.getNotifyUrl();
	appConfiguration.services.notify.serviceId = 'g09j298f-q59t-9a34-f123-782342hj910l';
	appConfiguration.services.notify.templates[
		'1001'
	].appealSubmissionConfirmationEmailToAppellant = 1;
	appConfiguration.services.notify.templates['1001'].appealNotificationEmailToLpa = 2;
	appConfiguration.services.notify.templates[
		'1005'
	].appealSubmissionConfirmationEmailToAppellant = 3;
	appConfiguration.services.notify.templates['1005'].appealNotificationEmailToLpa = 4;
	appConfiguration.services.notify.templates.ERROR_MONITORING.failureToUploadToHorizon = 6;
	appConfiguration.services.notify.emails.adminMonitoringEmail = 'test@pins.gov.uk';
	appConfiguration.documents.url = mockedExternalApis.getDocumentsAPIUrl();

	/////////////////////
	///// SETUP APP /////
	/////////////////////

	let server = http.createServer(app);
	appealsApi = supertest(server);

	/////////////////////////////////
	///// POPULATE STATIC DATA /////
	///////////////////////////////

	const testLpaJson = `{OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED\n323;${testLpaCodeEngland};;${testLpaNameEngland};${testLpaEmail};;TRUE\n324;${testLpaCodeWales};${testHorizonLpaCodeWales};${testLpaNameWales};${testLpaEmail};;TRUE}`;
	await appealsApi.post('/api/v1/local-planning-authorities').send(testLpaJson);
});

beforeEach(async () => {
	await mockedExternalApis.clearAllMockedResponsesAndRecordedInteractions();
	jest.clearAllMocks();

	await _clearDatabaseCollections();
	expectedNotifyInteractions = [];
	await mockedExternalApis.mockNotifyResponse({}, 200);
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

// We check mock and message interactions consistently here so that they're not forgotten for each test :)
afterEach(async () => {
	// runs expect calls so may exit early
	await mockedExternalApis.checkInteractions(expectedNotifyInteractions);
});

afterAll(async () => {
	await sqlClient.$disconnect();
	await databaseConnection.close();
	await mockedExternalApis.teardown();
});

describe('Appeals', () => {
	it(`should return an error if we try to update an appeal that doesn't exist`, async () => {
		// When: an appeal is sent via a PUT or PATCH request, but hasn't yet been created
		const householderAppeal = AppealFixtures.newHouseholderAppeal(crypto.randomUUID());
		const putResponse = await appealsApi
			.put(`/api/v1/appeals/${householderAppeal.id}`)
			.send(householderAppeal);

		const patchResponse = await appealsApi
			.patch(`/api/v1/appeals/${householderAppeal.id}`)
			.send(householderAppeal);

		// Then: we should get a 404 status code for both requests
		expect(putResponse.status).toBe(404);
		expect(patchResponse.status).toBe(404);

		// And: external systems should be interacted with in the following ways
		expectedNotifyInteractions = [];
	});

	it("should apply patch updates correctly when data to patch-in isn't a full appeal", async () => {
		// Given: an appeal is created
		const { appealResponse: savedAppealResponse } = await _createAppeal();
		let savedAppeal = savedAppealResponse.body;

		// When: the appeal is patched
		const patchedAppealResponse = await appealsApi
			.patch(`/api/v1/appeals/${savedAppeal.id}`)
			.send({ horizonId: 'foo' });

		// Then: when we retrieve the appeal, it should have the patch applied
		savedAppeal.horizonId = 'foo';
		savedAppeal.updatedAt = patchedAppealResponse.body.updatedAt;
		expect(patchedAppealResponse.body).toMatchObject(savedAppeal);

		// And: no external systems should be interacted with
		expectedNotifyInteractions = [];
	});

	it('should set agent role if setting isOriginalApplicant false on HAS appeal', async () => {
		// Given: an appeal is created
		const householderAppeal = AppealFixtures.newHouseholderAppeal();
		householderAppeal.aboutYouSection.yourDetails.isOriginalApplicant = true;

		const { appealResponse: savedAppealResponse } = await _createAppeal(householderAppeal);

		if (!savedAppealResponse.ok) {
			throw new Error('failed to create appeal');
		}

		let savedAppeal = savedAppealResponse.body;

		const dataToSend = {
			id: savedAppeal.id,
			aboutYouSection: {
				yourDetails: {
					isOriginalApplicant: false
				}
			}
		};

		// When: the appeal is patched
		const patchedAppealResponse = await appealsApi
			.patch(`/api/v1/appeals/${savedAppeal.id}`)
			.send(dataToSend);

		expect(patchedAppealResponse.body.aboutYouSection.yourDetails.isOriginalApplicant).toBe(false);

		const appeal = await sqlClient.appeal.findFirst({
			where: {
				legacyAppealSubmissionId: savedAppeal.id
			},
			include: {
				Users: true
			}
		});
		expect(appeal.Users.length).toBe(1);
		expect(appeal.Users[0].role).toBe(APPEAL_USER_ROLES.AGENT);

		// And: no external systems should be interacted with
		expectedNotifyInteractions = [];
	});

	it('should set agent role if setting isOriginalApplicant false on S76 appeal', async () => {
		// Given: an appeal is created
		const fullAppeal = AppealFixtures.newFullAppeal();
		fullAppeal.contactDetailsSection.isOriginalApplicant = true;

		const { appealResponse: savedAppealResponse } = await _createAppeal(fullAppeal);

		if (!savedAppealResponse.ok) {
			throw new Error('failed to create appeal');
		}

		let savedAppeal = savedAppealResponse.body;

		const dataToSend = {
			id: savedAppeal.id,
			aboutYouSection: {
				yourDetails: {
					isOriginalApplicant: false
				}
			}
		};

		// When: the appeal is patched
		const patchedAppealResponse = await appealsApi
			.patch(`/api/v1/appeals/${savedAppeal.id}`)
			.send(dataToSend);

		expect(patchedAppealResponse.body.aboutYouSection.yourDetails.isOriginalApplicant).toBe(false);

		const appeal = await sqlClient.appeal.findFirst({
			where: {
				legacyAppealSubmissionId: savedAppeal.id
			},
			include: {
				Users: true
			}
		});
		expect(appeal.Users.length).toBe(1);
		expect(appeal.Users[0].role).toBe(APPEAL_USER_ROLES.AGENT);

		// And: no external systems should be interacted with
		expectedNotifyInteractions = [];
	});

	it('should return the relevant appeal when requested after the appeal has been saved', async () => {
		// Given: an appeal is created
		const { appealResponse: savedAppeal } = await _createAppeal();

		// When: we try to request that appeal
		const requestedAppeal = await appealsApi.get(`/api/v1/appeals/${savedAppeal.body.id}`);

		// Then: we should get a 200 status
		expect(requestedAppeal.status).toEqual(200);

		// And: the correct appeal should be returned
		expect(requestedAppeal.body.id).toEqual(savedAppeal.body.id);

		// And: external systems should be interacted with in the following ways
		expectedNotifyInteractions = [];
	});

	it(`should return an error if an appeal is requested that doesn't exist`, async () => {
		// When: we try to access a non-existent appeal
		const getAppealResponse = await appealsApi.get(`/api/v1/appeals/${crypto.randomUUID()}`);

		// Then: we should get a 404 status
		expect(getAppealResponse.status).toEqual(404);

		// And: external systems should be interacted with in the following ways
		expectedNotifyInteractions = [];
	});
});

/**
 * @param {*} householderAppeal
 * @returns {Promise.<{appealResponse: *, userResponse: import('@prisma/client').AppealUser}>}
 */
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

/**
 *
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

	userIds.push(user.id);

	return user;
};
