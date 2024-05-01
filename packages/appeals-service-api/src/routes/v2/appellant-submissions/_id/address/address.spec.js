const supertest = require('supertest');
const app = require('../../../../../app');
const { createPrismaClient } = require('../../../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { seedDev } = require('@pins/database/src/seed/data-dev');

const { isFeatureActive } = require('../../../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

const testAppellantSubmissionId = 'a99c8871-2a4a-4e9c-85b3-498e39d5fafb';
const invalidUser = '29670d0f-c4b4-4047-8ee0-d62b93e91a12';
const validUser = '29670d0f-c4b4-4047-8ee0-d62b93e91a11';

jest.mock('../../../../../configuration/featureFlag');
jest.mock('../../../../../../src/services/object-store');
jest.mock('express-oauth2-jwt-bearer', () => {
	let currentSub = validUser;

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
		}),
		setCurrentSub: (newSub) => {
			currentSub = newSub;
		}
	};
});

jest.setTimeout(30000);

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
	await seedDev(sqlClient);
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
	await sqlClient.$disconnect();
	await _clearSqlData();
});

describe('/appellant-submissions/_id/address', () => {
	it('post creates or updates the address', async () => {
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const testAddress = {
			addressLine1: 'line 1',
			addressLine2: 'line 2',
			townCity: 'test town',
			postcode: 'postcode',
			fieldName: 'question-field-name',
			county: 'county'
		};

		// adds first address
		const addressResponse = await appealsApi
			.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
			.send(testAddress);

		expect(addressResponse.status).toEqual(200);
		expect(addressResponse.body.SubmissionAddress.length).toBe(1);
		expect(addressResponse.body.SubmissionAddress[0]).toEqual(expect.objectContaining(testAddress));

		// updates address
		const firstId = addressResponse.body.SubmissionAddress[0].id;
		const addressResponse2 = await appealsApi
			.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
			.send({
				id: firstId,
				...testAddress,
				addressLine1: 'changed'
			});

		expect(addressResponse2.status).toEqual(200);
		expect(addressResponse2.body.SubmissionAddress.length).toBe(1);
		expect(addressResponse2.body.SubmissionAddress[0]).toEqual(
			expect.objectContaining({
				id: firstId,
				addressLine1: 'changed'
			})
		);

		// adds new address
		const addressResponse3 = await appealsApi
			.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
			.send(testAddress);

		expect(addressResponse3.status).toEqual(200);
		expect(addressResponse3.body.SubmissionAddress.length).toBe(2);
	});

	it('post should 403 with invalid user', async () => {
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(invalidUser);

		const testAddress = {
			addressLine1: 'line 1',
			addressLine2: 'line 1',
			townCity: 'test town',
			postcode: 'postcode',
			fieldName: 'question-field-name',
			county: 'county'
		};

		// adds first address
		const addressResponse = await appealsApi
			.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
			.send(testAddress);

		expect(addressResponse.status).toEqual(403);
	});

	it('delete removes the address', async () => {
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const testAddress = {
			addressLine1: 'line 1',
			addressLine2: 'line 1',
			townCity: 'test town',
			postcode: 'postcode',
			fieldName: 'question-field-name',
			county: 'county'
		};

		// adds first address
		const addressResponse = await appealsApi
			.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
			.send(testAddress);

		expect(addressResponse.status).toEqual(200);

		const addressId = addressResponse.body.SubmissionAddress[0].id;
		const addressCount = addressResponse.body.SubmissionAddress.length;

		// delete address
		const deleteResponse = await appealsApi
			.delete(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address/${addressId}`)
			.send();

		expect(deleteResponse.body.SubmissionAddress.length).toBe(addressCount - 1);
		expect(deleteResponse.status).toEqual(200);
	});

	it('delete should 403 with invalid user', async () => {
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const testAddress = {
			addressLine1: 'line 1',
			addressLine2: 'line 1',
			townCity: 'test town',
			postcode: 'postcode',
			fieldName: 'question-field-name',
			county: 'county'
		};

		// adds first address
		const addressResponse = await appealsApi
			.post(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address`)
			.send(testAddress);

		expect(addressResponse.status).toEqual(200);
		const addressId = addressResponse.body.SubmissionAddress[0].id;

		setCurrentSub(invalidUser);

		// delete address
		const deleteResponse = await appealsApi
			.delete(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address/${addressId}`)
			.send();

		expect(deleteResponse.status).toEqual(403);
	});
});

/**
 * @returns {Promise.<void>}
 */
const _clearSqlData = async () => {
	await sqlClient.submissionAddress.deleteMany();
};
