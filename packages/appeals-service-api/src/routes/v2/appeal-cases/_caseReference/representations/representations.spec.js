const supertest = require('supertest');
const app = require('../../../../../app');
const { createPrismaClient } = require('../../../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { APPEAL_USER_ROLES, REPRESENTATION_TYPES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');
const {
	createTestRepresentationPayload
} = require('../../../../../../__tests__/developer/fixtures/representation-data');
const { isFeatureActive } = require('../../../../../configuration/featureFlag');
/** @type {import('@prisma/client').PrismaClient} */
let sqlClient;
/** @type {import('supertest').SuperTest<import('supertest').Test>} */
let appealsApi;
let validUser;
const validLpa = 'Q9999';
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

jest.mock('@pins/common/src/middleware/validate-token', () => {
	let currentLpa = validLpa;

	return {
		validateToken: jest.fn(() => {
			return (req, _res, next) => {
				req.id_token = {
					lpaCode: currentLpa,
					email: 'testEmail@test.com'
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
			email: crypto.randomUUID() + '@example.com',
			serviceUserId: 'userID'
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
				create: createTestAppealCase(caseRef, 'S78', validLpa)
			}
		}
	});
	return appeal.AppealCase?.caseReference;
};

describe('/appeal-cases/{caseReference}/representations', () => {
	describe('put', () => {
		it('should upsert a representation', async () => {
			const testRepId = '12345';
			const testCaseRef = '7845678';

			await createAppeal(testCaseRef);

			const testPutRepresentation = createTestRepresentationPayload(
				testRepId,
				testCaseRef,
				REPRESENTATION_TYPES.STATEMENT
			);

			const response = await appealsApi
				.put(`/api/v2/appeal-cases/${testCaseRef}/representations/${testRepId}`)
				.send(testPutRepresentation);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('caseReference', testCaseRef);
			expect(response.body).toHaveProperty('representationId', testRepId);
			const repDocs = await sqlClient.representationDocument.findMany({
				where: {
					representationId: response.body.id
				}
			});
			expect(repDocs.length).toBe(1);
		});
	});

	describe('get', () => {
		it('should retrieve all representations for the given case reference', async () => {
			const testCaseRef = '7834587';
			const testRepId1 = '23456';
			const testRepId2 = '34567';
			await createAppeal(testCaseRef);

			const testGetRepresentation1 = createTestRepresentationPayload(
				testRepId1,
				testCaseRef,
				REPRESENTATION_TYPES.STATEMENT
			);
			const testGetRepresentation2 = createTestRepresentationPayload(
				testRepId2,
				testCaseRef,
				REPRESENTATION_TYPES.FINAL_COMMENT,
				'citizen'
			);

			await appealsApi
				.put(`/api/v2/appeal-cases/${testCaseRef}/representations/${testRepId1}`)
				.send(testGetRepresentation1);

			await appealsApi
				.put(`/api/v2/appeal-cases/${testCaseRef}/representations/${testRepId2}`)
				.send(testGetRepresentation2);

			const response = await appealsApi.get(`/api/v2/appeal-cases/${testCaseRef}/representations`);
			expect(response.status).toEqual(200);
			expect(response.body.Representations.length).toBe(2);
			expect(response.body.Representations).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						caseReference: testCaseRef,
						representationId: testRepId1,
						source: 'lpa',
						representationType: REPRESENTATION_TYPES.STATEMENT
					}),
					expect.objectContaining({
						caseReference: testCaseRef,
						representationId: testRepId2,
						source: 'citizen',
						representationType: REPRESENTATION_TYPES.FINAL_COMMENT
					})
				])
			);
		});

		it('should retrieve representations filtered by type', async () => {
			const testCaseRef = '7834588';
			const testRepId3 = '45678';
			const testRepId4 = '56789';
			await createAppeal(testCaseRef);

			const testGetRepresentation3 = createTestRepresentationPayload(
				testRepId3,
				testCaseRef,
				REPRESENTATION_TYPES.STATEMENT
			);
			const testGetRepresentation4 = createTestRepresentationPayload(
				testRepId4,
				testCaseRef,
				REPRESENTATION_TYPES.FINAL_COMMENT,
				'citizen'
			);

			await appealsApi
				.put(`/api/v2/appeal-cases/${testCaseRef}/representations/${testRepId3}`)
				.send(testGetRepresentation3);

			await appealsApi
				.put(`/api/v2/appeal-cases/${testCaseRef}/representations/${testRepId4}`)
				.send(testGetRepresentation4);

			const response = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/representations?type=statement`
			);
			expect(response.status).toEqual(200);
			expect(response.body.Representations.length).toBe(1);
			expect(response.body.Representations[0]).toMatchObject({
				caseReference: testCaseRef,
				representationId: testRepId3,
				representationType: REPRESENTATION_TYPES.STATEMENT
			});
		});
	});
});
