const http = require('http');
const supertest = require('supertest');

const app = require('../../../app');
const { createPrismaClient } = require('../../../db/db-client');

const { isFeatureActive } = require('../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let lpaApi;

jest.mock('../../../configuration/featureFlag');
jest.mock('../../../../src/services/object-store');
jest.mock('express-oauth2-jwt-bearer', () => {
	let currentSub = '';

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

jest.setTimeout(10000);

const csvMock = `OBJECTID;LPA19CD;LPA CODE;LPA19NM;EMAIL;DOMAIN;LPA ONBOARDED
;E07000151;Y2810;Daventry District Council;plancare@daventrydc.gov.uk;daventrydc.gov.uk;TRUE
9;E60000009;X1355;County Durham;planning@durham.gov.uk;durham.gov.uk;TRUE
10;E60000010;N1350;Darlington;planning.enquiries@darlington.gov.uk;darlington.gov.uk;TRUE
11;E60000011;H0724;Hartlepool;developmentcontrol@hartlepool.gov.uk;hartlepool.gov.uk;TRUE
12;E60000012;W0734;Middlesbrough;developmentcontrol@middlesbrough.gov.uk;middlesbrough.gov.uk;TRUE`;

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE ////
	/////////////////////////////
	sqlClient = createPrismaClient();

	/////////////////////
	///// SETUP APP ////
	///////////////////
	let server = http.createServer(app);
	lpaApi = supertest(server);
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

function containsAny(arr1, arr2) {
	return arr1.some((item) => arr2.includes(item));
}

describe('LPAs v2', () => {
	describe('upload LPAs', () => {
		it('should upload upload all LPAs to the DB without error', async () => {
			const response = await lpaApi.post('/api/v2/lpa').send({
				csvMock
			});
			const getResponse = await lpaApi.get(`/api/v2/lpa`);
			expect(response.status).toBe(200);
			expect(getResponse.status).toBe(200);
			expect(getResponse.body.length).toBe(5);
		});

		it('should delete existing data and reupload without error', async () => {
			const response1 = await lpaApi.post('/api/v2/lpa').send({
				csvMock
			});
			const getResponse1 = await lpaApi.get(`/api/v2/lpa`);
			const response2 = await lpaApi.post('/api/v2/lpa').send({
				csvMock
			});
			const getResponse2 = await lpaApi.get(`/api/v2/lpa`);

			expect(response1.status).toBe(200);
			expect(response2.status).toBe(200);
			expect(getResponse1.status).toBe(200);
			expect(getResponse2.status).toBe(200);
			const doesContain = containsAny(
				getResponse1.body.map((x) => x.id),
				getResponse2.body.map((y) => y.id)
			);
			expect(doesContain).toBeFalsy();
			expect(getResponse2.body.length).toBe(5);
		});
	});

	describe('get LPA', () => {
		beforeAll(async () => {
			await sqlClient.lPA.deleteMany({});
			await sqlClient.lPA.createMany({
				data: [
					{
						domain: 'test.com',
						email: 'test1@test.com',
						inTrial: true,
						lpa19CD: 'E60000001',
						name: 'Test1',
						lpaCode: 'A1355',
						objectId: '1'
					},
					{
						domain: 'test.com',
						email: 'test2@test.com',
						inTrial: false,
						lpa19CD: 'E60000002',
						name: 'Test2',
						lpaCode: 'B1355',
						objectId: '2'
					}
				]
			});
		});

		it('should get all LPAs', async () => {
			const response = await lpaApi.get(`/api/v2/lpa`);
			expect(response.status).toBe(200);
			expect(response.body.length).toBe(2);
		});

		it('should get LPA by id', async () => {
			const allResponse = await lpaApi.get(`/api/v2/lpa`);
			let testId = allResponse.body[0].id;
			let testinTrial = allResponse.body[0].inTrial;
			let testEmail = allResponse.body[0].email;
			let testLpa19CD = allResponse.body[0].lpa19CD;
			let testLpaCode = allResponse.body[0].lpaCode;
			let testObjectId = allResponse.body[0].objectId;

			const response = await lpaApi.get(`/api/v2/lpa/${testId}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('id', testId);
			expect(response.body).toHaveProperty('inTrial', testinTrial);
			expect(response.body).toHaveProperty('email', testEmail);
			expect(response.body).toHaveProperty('lpa19CD', testLpa19CD);
			expect(response.body).toHaveProperty('lpaCode', testLpaCode);
			expect(response.body).toHaveProperty('objectId', testObjectId);
		});

		it('should fail to get LPA by id', async () => {
			const testId = '00000000-0000-00000-00000-0000000002';
			const response = await lpaApi.get(`/api/v2/lpa/${testId}`);

			expect(response.status).toBe(404);
		});

		it('should get LPA by lpaCode', async () => {
			const testCode = 'A1355';

			const response = await lpaApi.get(`/api/v2/lpa/lpaCode/${testCode}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('inTrial', true);
			expect(response.body).toHaveProperty('email', 'test1@test.com');
			expect(response.body).toHaveProperty('lpa19CD', 'E60000001');
			expect(response.body).toHaveProperty('lpaCode', testCode);
			expect(response.body).toHaveProperty('objectId', '1');
		});

		it('should fail to get LPA by lpaCode', async () => {
			const testCode = 'A1356';

			const response = await lpaApi.get(`/api/v2/lpa/lpaCode/${testCode}`);
			expect(response.status).toBe(404);
		});

		it('should get LPA by lpa19CD', async () => {
			const testlpa19CD = 'E60000001';

			const response = await lpaApi.get(`/api/v2/lpa/lpa19CD/${testlpa19CD}`);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('email', 'test1@test.com');
			expect(response.body).toHaveProperty('lpa19CD', testlpa19CD);
			expect(response.body).toHaveProperty('lpaCode', 'A1355');
			expect(response.body).toHaveProperty('objectId', '1');
			expect(response.body).toHaveProperty('inTrial', true);
		});

		it('should fail to get LPA by lpa19CD', async () => {
			const testlpa19CD = 'E60000003';
			const response = await lpaApi.get(`/api/v2/lpa/lpa19CD/${testlpa19CD}`);

			expect(response.status).toBe(404);
		});
	});
});
