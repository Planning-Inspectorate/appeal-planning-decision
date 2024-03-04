const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');
const {
	APPEALS_CASE_DATA: {
		APPEAL_TYPE: { HAS, S78 },
		VALIDITY: { IS_VALID }
	}
} = require('@pins/common/src/constants');

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
jest.mock('../../src/services/object-store');

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

		expect(q9999response.status).toBe(200);
		expect(q9999response.body.length).toBe(4);
		q9999response.body.forEach((result) => {
			expect(result.LPACode).toBe('Q9999');
			expect(result.validity).toBe(IS_VALID);
		});

		expect(l2440response.status).toBe(200);
		expect(l2440response.body.length).toBe(3);

		l2440response.body.forEach((result) => {
			expect(result.LPACode).toBe('L2440');
			expect(result.validity).toBe(IS_VALID);
		});
	});

	it('should return a url friendly slug for appeal case ref', async () => {
		const l2440response = await appealsApi.get(`/api/v1/appeals-case-data/L2440`);

		expect(l2440response.status).toBe(200);
		expect(l2440response.body.length).toEqual(3);
		expect(l2440response.body[0].caseReferenceSlug).toBe('%2F%40%2F1');
	});

	it('should 404 if no LPA code', async () => {
		const response = await appealsApi.get(`/api/v1/appeals-case-data/`);

		expect(response.status).toBe(404);
		expect(response.body).toEqual({});
	});
	it('should return a specific HAS case by lpacode and caseref', async () => {
		const caseReference = '0000013';
		const lpaCode = 'Q9999';
		const q9999response = await appealsApi.get(
			`/api/v1/appeals-case-data/${lpaCode}/${caseReference}`
		);
		expect(q9999response.status).toBe(200);
		expect(q9999response.body.LPAApplicationReference).toEqual('1234567/nop');
		expect(q9999response.body.LPACode).toEqual('Q9999');
		expect(q9999response.body.appealType).toEqual(HAS);
		expect(q9999response.body.caseReference).toEqual(caseReference);
		expect(q9999response.body.validity).toEqual(IS_VALID);
	});

	it('should return a specific S78 case by lpacode and caseref', async () => {
		const caseReference = '0000015';
		const lpaCode = 'L2440';
		const s78response = await appealsApi.get(
			`/api/v1/appeals-case-data/${lpaCode}/${caseReference}`
		);
		expect(s78response.status).toBe(200);
		expect(s78response.body.LPAApplicationReference).toEqual('9991234/abc');
		expect(s78response.body.LPACode).toEqual(lpaCode);
		expect(s78response.body.appealType).toEqual(S78);
		expect(s78response.body.caseReference).toEqual(caseReference);
		expect(s78response.body.validity).toEqual(IS_VALID);
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
