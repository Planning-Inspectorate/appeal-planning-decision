const supertest = require('supertest');
const app = require('../../../../../app');
const { createPrismaClient } = require('../../../../../db/db-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');

const { isFeatureActive } = require('../../../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

let testAppellantSubmissionId;
let invalidUser;
let validUser;

const addressIds = [];

jest.mock('../../../../../configuration/featureFlag');
jest.mock('../../../../../../src/services/object-store');
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

	const user = await sqlClient.appealUser.create({
		data: {
			email: crypto.randomUUID() + '@example.com'
		}
	});
	const user2 = await sqlClient.appealUser.create({
		data: {
			email: crypto.randomUUID() + '@example.com'
		}
	});
	const appeal = await sqlClient.appeal.create({
		select: {
			AppellantSubmission: true
		},
		data: {
			Users: {
				create: {
					userId: user.id,
					role: APPEAL_USER_ROLES.APPELLANT
				}
			},
			AppellantSubmission: {
				create: {
					LPACode: 'Q9999',
					appealTypeCode: 'HAS'
				}
			}
		}
	});
	validUser = user.id;
	invalidUser = user2.id;
	testAppellantSubmissionId = appeal.AppellantSubmission?.id;
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

		const addressId = addressResponse.body.SubmissionAddress[0].id;
		addressIds.push(addressId);

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

		const addressId2 = addressResponse2.body.SubmissionAddress[0].id;
		addressIds.push(addressId2);

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

		const addressId3 = addressResponse3.body.SubmissionAddress[0].id;
		addressIds.push(addressId3);

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
		addressIds.push(addressId);

		setCurrentSub(invalidUser);

		// delete address
		const deleteResponse = await appealsApi
			.delete(`/api/v2/appellant-submissions/${testAppellantSubmissionId}/address/${addressId}`)
			.send();

		expect(deleteResponse.status).toEqual(403);
	});
});
