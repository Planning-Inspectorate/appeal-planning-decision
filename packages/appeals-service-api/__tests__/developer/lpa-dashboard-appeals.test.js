const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');

const { isFeatureActive } = require('../../src/configuration/featureFlag');

const dbName = 'appealsCaseData';
let appealsApi;
let databaseConnection;

const fakeData = [
	{
		_id: '89aa8504-773c-42be-bb68-029716ad9756',
		LPACode: 'Q9999',
		caseReference: '3221288',
		LPAApplicationReference: '2323232/pla',
		questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
		decision: 'refused'
	},
	{
		_id: '90bb8504-773c-42be-bb68-029716ad9876',
		LPACode: 'L2440',
		caseReference: '3221299',
		LPAApplicationReference: '9898989/pla',
		questionnaireDueDate: '2023-07-07T13:53:31.6003126+00:00',
		decision: 'refused'
	}
];

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
	await _seedDatabase();
	isFeatureActive.mockImplementation(() => {
		return true;
	});
});

afterAll(async () => {
	if (databaseConnection) {
		await databaseConnection.close();
	}
});

describe('lpa-dashboard-appeals', () => {
	it('should return appeals based on LPA code', async () => {
		const response = await appealsApi.get(`/api/v1/lpa-dashboard-appeals/Q9999`);

		expect(response.status).toBe(200);
		expect(response.body.length).toBe(1);
		expect(response.body[0]._id).toEqual(fakeData[0]._id);
		expect(response.body[0].LPAApplicationReference).toEqual(fakeData[0].LPAApplicationReference);
		expect(response.body[0].caseReference).toEqual(fakeData[0].caseReference);
		expect(response.body[0].questionnaireDueDate).toEqual(fakeData[0].questionnaireDueDate);
		expect(response.body[0].decision).toBe(undefined);
		expect(response.body[0].LPACode).toBe(undefined);
	});

	it('should 404 if no LPA code', async () => {
		const response = await appealsApi.get(`/api/v1/lpa-dashboard-appeals/`);

		expect(response.status).toBe(404);
		expect(response.body).toEqual({});
	});
});

const _seedDatabase = async () => {
	const collection = await databaseConnection.db(dbName).collection('appealsCaseData');
	await collection.insertMany(fakeData);
};

const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db(dbName).collections();

	for (const collection of databaseCollections) {
		await collection.drop();
	}
};
