const http = require('http');
const supertest = require('supertest');

const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');

const { isFeatureActive } = require('../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

jest.mock('../../../configuration/featureFlag');
jest.mock('../../../../src/services/object-store');

// jest.setTimeout(140000);

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

	await seedStaticData(sqlClient);
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

describe('service users v2', () => {
	describe('create user', () => {
		it('should return 500 if unknown field supplied', async () => {
			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_001',
				unknownField: '123'
			});

			expect(response.status).toBe(500);
		});

		it('should create user', async () => {
			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_001',
				serviceUserType: 'Appellant',
				caseReference: '000001'
			});

			expect(response.status).toEqual(200);
		});
	});

	describe('update user', () => {
		it('should update service-users', async () => {
			const response = await appealsApi.put('/api/v2/service-users').send({
				id: 'usr_001',
				serviceUserType: 'Appellant',
				caseReference: '000001',
				emailAddress: 'name@example.com'
			});

			expect(response.status).toEqual(200);
		});
	});
});
