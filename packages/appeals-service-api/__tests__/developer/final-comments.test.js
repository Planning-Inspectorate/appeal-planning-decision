const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const container = require('rhea');
const crypto = require('crypto');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');
const appConfiguration = require('../../src/configuration/config');

const MockedExternalApis = require('./external-dependencies/rest-apis/mocked-external-apis');
const FinalCommentFixtures = require('./fixtures/finalComments');

const { isFeatureActive } = require('../../src/configuration/featureFlag');

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

const dbName = 'integration-test-final-comments-db';

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

	/////////////////////////////
	///// SETUP TEST CONFIG /////
	/////////////////////////////

	appConfiguration.secureCodes.finalComments.length = 4;
	appConfiguration.secureCodes.finalComments.expirationTimeInMinutes = 30;
	appConfiguration.secureCodes.finalComments.decipher.algorithm = 'aes-256-cbc';
	appConfiguration.secureCodes.finalComments.decipher.initVector = crypto.randomBytes(16);
	appConfiguration.secureCodes.finalComments.decipher.securityKey = crypto.randomBytes(32);
	appConfiguration.secureCodes.finalComments.decipher.inputEncoding = 'hex';
	appConfiguration.secureCodes.finalComments.decipher.outputEncoding = 'utf-8';
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
	appConfiguration.services.notify.emails.adminMonitoringEmail = 'test@pins.gov.uk';
	appConfiguration.documents.url = mockedExternalApis.getDocumentsAPIUrl();

	/////////////////////
	///// SETUP APP /////
	/////////////////////

	let server = http.createServer(app);
	appealsApi = supertest(server);

	/////////////////////////
	///// POPULATE LPAS /////
	/////////////////////////

	const testLpaJson = `{OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED\n323;${testLpaCodeEngland};;${testLpaNameEngland};${testLpaEmail};;TRUE\n324;${testLpaCodeWales};${testHorizonLpaCodeWales};${testLpaNameWales};${testLpaEmail};;TRUE}`;
	await appealsApi.post('/api/v1/local-planning-authorities').send(testLpaJson);
});

beforeEach(async () => {
	await _clearDatabaseCollections();
	expectedNotifyInteractions = [];
	await mockedExternalApis.mockNotifyResponse({}, 200);
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

// We check mock and message interactions consistently here so that they're not forgotten for each test :)
afterEach(async () => {
	await mockedExternalApis.checkInteractions(expectedNotifyInteractions);
	await mockedExternalApis.clearAllMockedResponsesAndRecordedInteractions();
	jest.clearAllMocks(); // We need to do this so that mock interactions are reset correctly between tests :)
});

afterAll(async () => {
	await databaseConnection.close();
	await mockedExternalApis.teardown();
});

describe('Final comments', () => {
	it('Should submit the final comment to the back-end when submitted before the expiry date', async () => {
		// Given: a final comment with an expiry date of tomorrow
		let today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		let expiryDate = tomorrow.toISOString();
		let horizonId = 1345678;

		let finalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: horizonId
		});

		// When: it is submitted to the back-end
		let response = await _createFinalComment(finalCommentToSubmit);

		// Then: It should return a status code of 201
		expect(response.status).toBe(201);

		// And: The back-end should contain one appeal for that horizon Id
		let submittedFinalComment = await appealsApi.get(`/api/v1/final-comments/${horizonId}`);
		expect(submittedFinalComment.status).toBe(201);
		expect(submittedFinalComment.body.length).toBe(1);
	});

	it('Should not submit the final comment if a final comment exists with the same horizonId and email', async () => {
		// Given: a final comment with an expiry date of tomorrow
		let today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		let expiryDate = tomorrow.toISOString();
		let horizonId = 1345678;

		let finalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: horizonId
		});

		// When: it is submitted to the back-end twice
		let firstResponse = await _createFinalComment(finalCommentToSubmit);
		let secondResponse = await _createFinalComment(finalCommentToSubmit);

		// Then: It should return a status code of 201 for the first
		expect(firstResponse.status).toBe(201);

		// And: Return a status code of 409 for the second
		expect(secondResponse.status).toBe(409);

		// And: The back-end should contain one final comment for that horizon Id
		let submittedFinalComment = await appealsApi.get(`/api/v1/final-comments/${horizonId}`);
		expect(submittedFinalComment.status).toBe(201);
		expect(submittedFinalComment.body.length).toBe(1);
	});

	it('Should not submit the final comment if the expiry date is in the past', async () => {
		// Given: A final comment with an expiry date in the past
		let today = new Date();
		let yesterday = new Date();
		yesterday.setDate(today.getDate() - 1);
		let expiryDate = yesterday.toISOString();
		let horizonId = 1345678;

		let finalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: horizonId
		});

		// When: it is submitted to the back end
		let response = await _createFinalComment(finalCommentToSubmit);

		// Then: It should return a status code of 409
		expect(response.status).toBe(409);

		// And: The back-end should not contain an final comment for the horizon Id
		let submittedFinalComment = await appealsApi.get(`/api/v1/final-comments/${horizonId}`);
		expect(submittedFinalComment.status).toBe(404);
	});

	it('Should submit 2 final comments if the final comments have a different horizonId', async () => {
		// Given: a final comment with an expiry date of tomorrow
		let today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		let expiryDate = tomorrow.toISOString();
		let firstHorizonId = 1345678;
		let secondHorizonId = 9999999;

		let firstFinalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: firstHorizonId
		});

		let secondFinalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: secondHorizonId
		});

		// When: it is submitted to the back-end twice
		let firstResponse = await _createFinalComment(firstFinalCommentToSubmit);
		let secondResponse = await _createFinalComment(secondFinalCommentToSubmit);

		// Then: It should return a status code of 201 for the both
		expect(firstResponse.status).toBe(201);
		expect(secondResponse.status).toBe(201);

		// And: The back-end should contain one final comment for each horizon Id
		let firstSubmittedFinalComment = await appealsApi.get(
			`/api/v1/final-comments/${firstHorizonId}`
		);
		expect(firstSubmittedFinalComment.status).toBe(201);
		expect(firstSubmittedFinalComment.body.length).toBe(1);

		let secondSubmittedFinalComment = await appealsApi.get(
			`/api/v1/final-comments/${secondHorizonId}`
		);
		expect(secondSubmittedFinalComment.status).toBe(201);
		expect(secondSubmittedFinalComment.body.length).toBe(1);
	});

	it('Should submit 2 final comments if the final comments have the same horizonId but different emails', async () => {
		// Given: a final comment with an expiry date of tomorrow
		let today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		let expiryDate = tomorrow.toISOString();
		let horizonId = 9999999;

		let firstFinalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: horizonId,
			email: 'test@example.com'
		});

		let secondFinalCommentToSubmit = FinalCommentFixtures.newFinalComment({
			finalCommentExpiryDate: expiryDate,
			horizonId: horizonId,
			email: 'test2@example.com'
		});

		// When: it is submitted to the back-end twice
		let firstResponse = await _createFinalComment(firstFinalCommentToSubmit);
		let secondResponse = await _createFinalComment(secondFinalCommentToSubmit);

		// Then: It should return a status code of 201 for the both
		expect(firstResponse.status).toBe(201);
		expect(secondResponse.status).toBe(201);

		// And: The back-end should contain two final comments for that horizonId
		let submittedFinalComments = await appealsApi.get(`/api/v1/final-comments/${horizonId}`);
		expect(submittedFinalComments.status).toBe(201);
		expect(submittedFinalComments.body.length).toBe(2);
	});
});

const _createFinalComment = async (finalComment) => {
	return await appealsApi.post('/api/v1/final-comments').send(finalComment);
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
