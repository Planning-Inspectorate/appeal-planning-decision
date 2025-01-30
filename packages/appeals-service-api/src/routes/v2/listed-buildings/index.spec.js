const http = require('http');
const supertest = require('supertest');

const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { isFeatureActive } = require('../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');
jest.mock('../../../../src/services/object-store');
jest.mock('express-oauth2-jwt-bearer', () => {
	let currentSub = 'abc';

	return {
		auth: jest.fn(() => {
			return (req, _res, next) => {
				req.auth = {
					payload: {
						sub: currentSub
					}
				};
				next();
			};
		})
	};
});

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

describe('listed-buildings', () => {
	it('should add and retrieve listed building from db', async () => {
		const updateResponse = await appealsApi
			.put('/api/v2/listed-buildings')
			.send(testListedBuildingJson);
		const getResponse = await appealsApi.get(
			`/api/v2/listed-buildings/${testListedBuildingJson[0].reference}`
		);

		expect(updateResponse.status).toBe(200);
		expect(getResponse.status).toBe(200);
		expect(getResponse.body).toEqual(expect.objectContaining(testListedBuildingJson[0]));
	});

	it('should create and update entries in db', async () => {
		await appealsApi.put('/api/v2/listed-buildings').send(testListedBuildingJson);

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
		const updateResponse = await appealsApi.put('/api/v2/listed-buildings').send(updateData);

		const getUpdate = await appealsApi.get(`/api/v2/listed-buildings/${updateData[0].reference}`);
		const getCreate = await appealsApi.get(`/api/v2/listed-buildings/${updateData[1].reference}`);
		const getOld = await appealsApi.get(
			`/api/v2/listed-buildings/${testListedBuildingJson[1].reference}`
		);

		expect(updateResponse.status).toBe(200);

		expect(getUpdate.status).toBe(200);
		expect(getUpdate.body).toEqual(expect.objectContaining(updateData[0]));

		expect(getCreate.status).toBe(200);
		expect(getCreate.body).toEqual(expect.objectContaining(updateData[1]));

		expect(getOld.status).toBe(200);
		expect(getOld.body).toEqual(expect.objectContaining(testListedBuildingJson[1]));
	});

	it('should handle single update', async () => {
		const updateResponse = await appealsApi
			.put('/api/v2/listed-buildings')
			.send(testListedBuildingJson[0]);
		const getResponse = await appealsApi.get(
			`/api/v2/listed-buildings/${testListedBuildingJson[0].reference}`
		);

		expect(updateResponse.status).toBe(200);
		expect(getResponse.status).toBe(200);
		expect(getResponse.body).toEqual(expect.objectContaining(testListedBuildingJson[0]));
	});

	it('put should return 400 with bad request', async () => {
		const updateResponse = await appealsApi.put('/api/v2/listed-buildings').send({ hello: 1 });

		expect(updateResponse.status).toBe(400);
	});

	it('get should return 404 with no listed building', async () => {
		const response = await appealsApi.get(`/api/v2/listed-buildings/nope`);
		expect(response.status).toBe(404);
	});

	it('put should allow additional properties other than required by schema', async () => {
		const updateResponse = await appealsApi.put('/api/v2/listed-buildings').send({
			...testListedBuildingJson[0],
			anotherProp: 1
		});

		expect(updateResponse.status).toBe(200);
	});
});
