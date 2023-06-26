const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');

const { isFeatureActive } = require('../../src/configuration/featureFlag');

let appealsApi;
let databaseConnection;
const dbName = 'lpas';
let testLpaEmail = 'appealplanningdecisiontest@planninginspectorate.gov.uk';
let testLpaCodeEngland = 'E69999999';
let testLpaCodeWales = 'W69999999';
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

describe('lpas', () => {
	it('should create lpas and return them', async () => {
		// Given a valid lpa list
		const testLpaJson = `{OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED\n323;${testLpaCodeEngland};;${testLpaNameEngland};${testLpaEmail};;TRUE\n324;${testLpaCodeWales};${testHorizonLpaCodeWales};${testLpaNameWales};${testLpaEmail};;TRUE}`;

		// When those lpas are posted to server
		const response = await appealsApi.post('/api/v1/local-planning-authorities').send(testLpaJson);

		// Then: It should return a status code of 200
		expect(response.status).toBe(200);

		// And: The back-end should contain 2 lpas
		const lpas = await appealsApi.get('/api/v1/local-planning-authorities');
		expect(lpas.body.data.length).toBe(2);
	});

	it('should get lpa by ons code', async () => {
		// Given a valid lpa list
		const testLpaJson = `{OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED\n323;${testLpaCodeEngland};;${testLpaNameEngland};${testLpaEmail};;TRUE\n324;${testLpaCodeWales};${testHorizonLpaCodeWales};${testLpaNameWales};${testLpaEmail};;TRUE}`;
		await appealsApi.post('/api/v1/local-planning-authorities').send(testLpaJson);

		// When getting an lpa by ons code
		const response = await appealsApi.get(
			`/api/v1/local-planning-authorities/${testLpaCodeEngland}`
		);

		// Then: It should return that lpa
		expect(response.status).toBe(200);
		expect(response.body.lpa19CD).toBe(testLpaCodeEngland);
	});

	it('should get lpa by lpaCode', async () => {
		// Given a valid lpa list
		const testLpaJson = `{OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED\n323;${testLpaCodeEngland};an-lpa-code;${testLpaNameEngland};${testLpaEmail};;TRUE\n324;${testLpaCodeWales};${testHorizonLpaCodeWales};${testLpaNameWales};${testLpaEmail};;TRUE}`;
		await appealsApi.post('/api/v1/local-planning-authorities').send(testLpaJson);

		// When getting an lpa by lpacode
		const response = await appealsApi.get(`/api/v1/local-planning-authorities/lpaCode/an-lpa-code`);

		// Then: It should return that lpa
		expect(response.status).toBe(200);
		expect(response.body.lpa19CD).toBe(testLpaCodeEngland);
	});
});

/**
 * Clears out all collection from the database
 */
const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db(dbName).collections();

	for (const collection of databaseCollections) {
		await collection.drop();
	}
};
