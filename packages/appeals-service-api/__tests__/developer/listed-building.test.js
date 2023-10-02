const http = require('http');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');

const app = require('../../src/app');
const appDbConnection = require('../../src/db/db');

const dbName = 'listedBuildings';

let databaseConnection;
let appealsApi;
let mockedDatabase;

jest.setTimeout(120000);
jest.mock('../../src/db/db');

const testListedBuildingJson = [
	{
		name: '10 and 10A Special House',
		reference: '1010101',
		listedBuildingGrade: 'II'
	},
	{
		name: 'AN IMPORTANT BUILDING',
		reference: '1010102',
		listedBuildingGrade: 'II*'
	},
	{
		name: 'Exceptional Building',
		reference: '1010103',
		listedBuildingGrade: 'I'
	}
];

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE /////
	///////////////////////////////

	databaseConnection = await MongoClient.connect(process.env.INTEGRATION_TEST_DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	appDbConnection.connect();
	mockedDatabase = await databaseConnection.db(dbName);

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
});

afterAll(async () => {
	if (databaseConnection) {
		await databaseConnection.close();
	}
	jest.useRealTimers();
});

describe('listed-buildings', () => {
	it('should add and retrieve listed building from db', async () => {
		const updateResponse = await appealsApi
			.put('/api/v1/listed-buildings')
			.send(testListedBuildingJson);
		const getResponse = await appealsApi.get(
			`/api/v1/listed-buildings/${testListedBuildingJson[0].reference}`
		);

		expect(updateResponse.status).toBe(201);
		expect(getResponse.status).toBe(200);
		expect(getResponse.body).toEqual(expect.objectContaining(testListedBuildingJson[0]));
	});

	it('should create and update entries in db', async () => {
		await appealsApi.put('/api/v1/listed-buildings').send(testListedBuildingJson);

		const updateData = [
			{
				name: 'update',
				reference: testListedBuildingJson[0].reference,
				listedBuildingGrade: 'V'
			},
			{
				name: 'create',
				reference: '201',
				listedBuildingGrade: 'I'
			}
		];
		const updateResponse = await appealsApi.put('/api/v1/listed-buildings').send(updateData);

		const getUpdate = await appealsApi.get(`/api/v1/listed-buildings/${updateData[0].reference}`);
		const getCreate = await appealsApi.get(`/api/v1/listed-buildings/${updateData[1].reference}`);
		const getOld = await appealsApi.get(
			`/api/v1/listed-buildings/${testListedBuildingJson[1].reference}`
		);

		expect(updateResponse.status).toBe(201);

		expect(getUpdate.status).toBe(200);
		expect(getUpdate.body).toEqual(expect.objectContaining(updateData[0]));

		expect(getCreate.status).toBe(200);
		expect(getCreate.body).toEqual(expect.objectContaining(updateData[1]));

		expect(getOld.status).toBe(200);
		expect(getOld.body).toEqual(expect.objectContaining(testListedBuildingJson[1]));
	});

	it('should handle single update', async () => {
		const updateResponse = await appealsApi
			.put('/api/v1/listed-buildings')
			.send(testListedBuildingJson[0]);
		const getResponse = await appealsApi.get(
			`/api/v1/listed-buildings/${testListedBuildingJson[0].reference}`
		);

		expect(updateResponse.status).toBe(201);
		expect(getResponse.status).toBe(200);
		expect(getResponse.body).toEqual(expect.objectContaining(testListedBuildingJson[0]));
	});

	it('put should return 400 with bad request', async () => {
		const updateResponse = await appealsApi.put('/api/v1/listed-buildings').send({ hello: 1 });

		expect(updateResponse.status).toBe(400);
	});

	it('get should return 404 with no listed building', async () => {
		const response = await appealsApi.get(`/api/v1/listed-buildings/nope`);
		expect(response.status).toBe(404);
	});

	it('put should allow additional properties other than required by schema', async () => {
		const updateResponse = await appealsApi.put('/api/v1/listed-buildings').send({
			...testListedBuildingJson[0],
			anotherProp: 1
		});

		expect(updateResponse.status).toBe(201);
	});
});

const _clearDatabaseCollections = async () => {
	const databaseCollections = await databaseConnection.db(dbName).collections();
	for (const collection of databaseCollections) {
		await collection.drop();
	}
};
