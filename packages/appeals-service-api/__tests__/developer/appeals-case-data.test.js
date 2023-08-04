const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');

const { isFeatureActive } = require('../../src/configuration/featureFlag');
const { fakeAppealsCaseData } = require('./fixtures/appeals-case-data');

const appealsCaseData = fakeAppealsCaseData();

const dbName = 'appealsCaseData';
let appealsApi;
let databaseConnection;

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

describe('appeals-case-data', () => {
	it('should return sorted (by questionnaireDueDate) and filtered valid appeals data based on LPA code and status', async () => {
		const q9999response = await appealsApi.get(`/api/v1/appeals-case-data/Q9999`);
		const l2440response = await appealsApi.get(`/api/v1/appeals-case-data/L2440`);
		const sortedValidTestAppealIndexes = [14, 12, 13, 11];

		expect(q9999response.status).toBe(200);
		expect(q9999response.body.length).toBe(4);

		q9999response.body.forEach((result, index) => {
			const caseDataIndex = sortedValidTestAppealIndexes[index];
			expect(result._id).toEqual(appealsCaseData[caseDataIndex]._id);
			expect(result.LPAApplicationReference).toEqual(
				appealsCaseData[caseDataIndex].LPAApplicationReference
			);
			expect(result.caseReference).toEqual(appealsCaseData[caseDataIndex].caseReference);
			expect(result.caseReferenceSlug).toEqual(appealsCaseData[caseDataIndex].caseReference);
			expect(result.questionnaireDueDate).toEqual(
				appealsCaseData[caseDataIndex].questionnaireDueDate.toISOString()
			);
			expect(result.LPACode).toBe(undefined);
			expect(result.validity).toBe(undefined);
			expect(result.questionnaireReceived).toBe(undefined);
		});

		expect(l2440response.status).toBe(200);
		expect(l2440response.body.length).toBe(2);
		expect(l2440response.body[0]._id).toEqual(appealsCaseData[9]._id);
		expect(l2440response.body[0].LPAApplicationReference).toEqual(
			appealsCaseData[9].LPAApplicationReference
		);
		expect(l2440response.body[0].caseReference).toEqual(appealsCaseData[9].caseReference);
		expect(l2440response.body[0].questionnaireDueDate).toEqual(
			appealsCaseData[9].questionnaireDueDate.toISOString()
		);
		expect(l2440response.body[0].LPACode).toBe(undefined);
		expect(l2440response.body[0].validity).toBe(undefined);
		expect(l2440response.body[0].questionnaireReceived).toBe(undefined);
	});

	it('should return a url friendly slug for appeal case ref', async () => {
		const l2440response = await appealsApi.get(`/api/v1/appeals-case-data/L2440`);

		expect(l2440response.status).toBe(200);
		expect(l2440response.body.length).toEqual(2);
		expect(l2440response.body[1].caseReferenceSlug).toBe('%2F%40%2F1');
	});

	it('should 404 if no LPA code', async () => {
		const response = await appealsApi.get(`/api/v1/appeals-case-data/`);

		expect(response.status).toBe(404);
		expect(response.body).toEqual({});
	});
});

const _seedDatabase = async () => {
	const collection = await databaseConnection.db(dbName).collection('appealsCaseData');
	await collection.insertMany(appealsCaseData);
};

const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db(dbName).collections();

	for (const collection of databaseCollections) {
		await collection.drop();
	}
};
