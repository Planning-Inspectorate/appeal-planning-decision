const supertest = require('supertest');
const app = require('../../../../../../app');
const { createPrismaClient } = require('../../../../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../../__tests__/developer/fixtures/appeals-case-data');

const { isFeatureActive } = require('../../../../../../configuration/featureFlag');

/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;

let validUser;
const validLpa = 'Q9999';
const invalidLpa = 'nope';

jest.mock('../../../../../../configuration/featureFlag');
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

jest.mock('@pins/common/src/middleware/validate-token', () => {
	let currentLpa = validLpa;

	return {
		validateToken: jest.fn(() => {
			return (req, _res, next) => {
				req.id_token = {
					lpaCode: currentLpa
				};
				next();
			};
		}),
		setCurrentLpa: (newLpa) => {
			currentLpa = newLpa;
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

	const user = await sqlClient.appealUser.create({
		data: {
			email: crypto.randomUUID() + '@example.com'
		}
	});
	validUser = user.id;
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

/**
 * @returns {Promise<string>}
 */
const createAppeal = async (caseRef) => {
	const appeal = await sqlClient.appeal.create({
		include: {
			AppealCase: true
		},
		data: {
			Users: {
				create: {
					userId: validUser,
					role: APPEAL_USER_ROLES.APPELLANT
				}
			},
			AppealCase: {
				create: createTestAppealCase(caseRef, 'HAS', validLpa)
			}
		}
	});
	return appeal.AppealCase?.caseReference;
};

describe('/appeal-cases/_caseReference/lpa-questionnaire-submission/address', () => {
	it('post creates or updates the address', async () => {
		const testCaseRef = '3333333';
		await createAppeal(testCaseRef);
		await sqlClient.lPAQuestionnaireSubmission.create({
			data: {
				appealCaseReference: testCaseRef
			}
		});

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
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
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-questionnaire-submission/address`)
			.send(testAddress);

		expect(addressResponse.status).toEqual(200);
		expect(addressResponse.body.SubmissionAddress.length).toBe(1);
		expect(addressResponse.body.SubmissionAddress[0]).toEqual(expect.objectContaining(testAddress));

		// updates address
		const firstId = addressResponse.body.SubmissionAddress[0].id;
		const addressResponse2 = await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-questionnaire-submission/address`)
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
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-questionnaire-submission/address`)
			.send(testAddress);

		expect(addressResponse3.status).toEqual(200);
		expect(addressResponse3.body.SubmissionAddress.length).toBe(2);
	});

	it('post should 403 with user not from lpa user', async () => {
		const testCaseRef = '4444444';
		await createAppeal(testCaseRef);
		await sqlClient.lPAQuestionnaireSubmission.create({
			data: {
				appealCaseReference: testCaseRef
			}
		});

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(invalidLpa);
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
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-questionnaire-submission/address`)
			.send(testAddress);

		expect(addressResponse.status).toEqual(403);
	});

	it('delete removes the address', async () => {
		const testCaseRef = '5555555';
		await createAppeal(testCaseRef);
		await sqlClient.lPAQuestionnaireSubmission.create({
			data: {
				appealCaseReference: testCaseRef
			}
		});
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
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
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-questionnaire-submission/address`)
			.send(testAddress);

		expect(addressResponse.status).toEqual(200);

		const addressId = addressResponse.body.SubmissionAddress[0].id;
		const addressCount = addressResponse.body.SubmissionAddress.length;

		// delete address
		const deleteResponse = await appealsApi
			.delete(
				`/api/v2/appeal-cases/${testCaseRef}/lpa-questionnaire-submission/address/${addressId}`
			)
			.send();

		expect(deleteResponse.body.SubmissionAddress.length).toBe(addressCount - 1);
		expect(deleteResponse.status).toEqual(200);
	});

	it('delete should 403 with invalid user', async () => {
		const testCaseRef = '6666666';
		await createAppeal(testCaseRef);
		await sqlClient.lPAQuestionnaireSubmission.create({
			data: {
				appealCaseReference: testCaseRef
			}
		});
		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
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
			.post(`/api/v2/appeal-cases/${testCaseRef}/lpa-questionnaire-submission/address`)
			.send(testAddress);

		expect(addressResponse.status).toEqual(200);
		const addressId = addressResponse.body.SubmissionAddress[0].id;

		setCurrentLpa(invalidLpa);

		// delete address
		const deleteResponse = await appealsApi
			.delete(
				`/api/v2/appeal-cases/${testCaseRef}/lpa-questionnaire-submission/address/${addressId}`
			)
			.send();

		expect(deleteResponse.status).toEqual(403);
	});
});
