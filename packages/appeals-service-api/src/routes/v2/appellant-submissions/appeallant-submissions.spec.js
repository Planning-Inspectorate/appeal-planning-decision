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
jest.mock('express-oauth2-jwt-bearer', () => ({
	// eslint-disable-next-line no-unused-vars
	auth: jest.fn((_options) => {
		return (req, _res, next) => {
			req.auth = {
				payload: {
					sub: '29670d0f-c4b4-4047-8ee0-d62b93e91a11'
				}
			};
			next();
		};
	})
}));

jest.mock('express-oauth2-jwt-bearer');

jest.setTimeout(10000);

beforeAll(async () => {
	///////////////////////////////
	///// SETUP TEST DATABASE ////
	/////////////////////////////
	sqlClient = createPrismaClient();

	/////////////////////
	///// SETUP APP ////
	///////////////////
	appealsApi = supertest(app);

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
	// clear sql db
	await _clearSqlData();
	await sqlClient.$disconnect();
});

let createdAppellantSubmissionId = '';

describe('/appellant-submissions', () => {
	it('put', async () => {
		const response = await appealsApi.put('/api/v2/appellant-submissions').send({
			LPACode: 'Q9999',
			appealTypeCode: 'HAS',
			appealId: 'd679eff9-c073-4349-8237-aefc1b5ae783'
		});

		expect(response.body).toMatchObject({
			id: expect.stringMatching(/[a-f0-9-]{36}/),
			LPACode: 'Q9999',
			appealTypeCode: 'HAS',
			appealId: 'd679eff9-c073-4349-8237-aefc1b5ae783'
		});

		createdAppellantSubmissionId = response.body.id;
	});

	describe('/appellant-submissions/:id', () => {
		it('get', async () => {
			expect(createdAppellantSubmissionId).toMatch(/[a-f0-9-]{36}/);

			const response = await appealsApi.get(
				`/api/v2/appellant-submissions/${createdAppellantSubmissionId}`
			);

			expect(response.body).toEqual({
				id: createdAppellantSubmissionId,
				LPACode: 'Q9999',
				appealTypeCode: 'HAS',
				appealId: 'd679eff9-c073-4349-8237-aefc1b5ae783'
			});
		});

		it('patch', async () => {
			expect(createdAppellantSubmissionId).toMatch(/[a-f0-9-]{36}/);

			const response = await appealsApi
				.patch(`/api/v2/appellant-submissions/${createdAppellantSubmissionId}`)
				.send({
					id: createdAppellantSubmissionId,
					appealTypeCode: 'S78'
				});

			expect(response.body).toEqual({
				id: createdAppellantSubmissionId,
				LPACode: 'Q9999',
				appealTypeCode: 'S78',
				appealId: 'd679eff9-c073-4349-8237-aefc1b5ae783'
			});
		});
	});
});

/**
 * @returns {Promise.<void>}
 */
const _clearSqlData = async () => {
	const { count } = await sqlClient.appellantSubmission.deleteMany();
	console.log(`Purged ${count} appellant submissions`);
};
