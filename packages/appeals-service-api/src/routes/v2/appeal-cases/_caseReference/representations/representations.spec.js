const supertest = require('supertest');
const app = require('../../../../../app');
const { createPrismaClient } = require('../../../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { APPEAL_USER_ROLES, REPRESENTATION_TYPES } = require('@pins/common/src/constants');
const crypto = require('crypto');
const {
	createTestAppealCase
} = require('../../../../../../__tests__/developer/fixtures/appeals-case-data');
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
				create: createTestAppealCase(caseRef, 'S78', validLpa)
			}
		}
	});
	return appeal.AppealCase?.caseReference;
};
describe('/appeal-cases/{caseReference}/representations', () => {
	describe('get', () => {
		it('should retrieve all representations for the given case reference', async () => {
			const testCaseRef = '7834587';
			await createAppeal(testCaseRef);

			await sqlClient.representation.createMany({
				data: [
					{
						caseReference: testCaseRef,
						representationId: 'testRep',
						representationStatus: 'published',
						originalRepresentation: 'This is a test rep'
					},
					{
						caseReference: testCaseRef,
						representationId: 'testRep2',
						representationStatus: 'published',
						originalRepresentation: 'This is another test rep'
					}
				]
			});
			const response = await appealsApi.get(`/api/v2/appeal-cases/${testCaseRef}/representations`);
			expect(response.status).toEqual(200);
			expect(response.body.Representations.length).toBe(2);
			expect(response.body.Representations).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						caseReference: testCaseRef,
						representationId: 'testRep',
						representationStatus: 'published',
						originalRepresentation: 'This is a test rep'
					}),
					expect.objectContaining({
						caseReference: testCaseRef,
						representationId: 'testRep2',
						representationStatus: 'published',
						originalRepresentation: 'This is another test rep'
					})
				])
			);
		});

		it('should retrieve representations filtered by type', async () => {
			const testCaseRef = '7834588';
			await createAppeal(testCaseRef);

			await sqlClient.representation.createMany({
				data: [
					{
						caseReference: testCaseRef,
						representationId: 'testRep3',
						representationStatus: 'published',
						representationType: REPRESENTATION_TYPES.STATEMENT,
						originalRepresentation: 'This is a test rep'
					},
					{
						caseReference: testCaseRef,
						representationId: 'testRep4',
						representationStatus: 'published',
						representationType: REPRESENTATION_TYPES.FINAL_COMMENT,
						originalRepresentation: 'This is another test rep'
					}
				]
			});
			const response = await appealsApi.get(
				`/api/v2/appeal-cases/${testCaseRef}/representations?type=statement`
			);
			expect(response.status).toEqual(200);
			expect(response.body.Representations.length).toBe(1);
			expect(response.body.Representations[0]).toMatchObject({
				caseReference: testCaseRef,
				representationId: 'testRep3',
				representationStatus: 'published',
				representationType: REPRESENTATION_TYPES.STATEMENT,
				originalRepresentation: 'This is a test rep'
			});
		});
	});

	describe('put', () => {
		it('should upsert a representation', async () => {
			const testCaseRef = '7845678';
			const testRepId = '12345';
			await createAppeal(testCaseRef);

			const testRep = {
				representationId: testRepId,
				caseReference: testCaseRef
			};

			const response = await appealsApi
				.put(`/api/v2/appeal-cases/${testCaseRef}/representations/${testRepId}`)
				.send(testRep);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('caseReference', testCaseRef);
			expect(response.body).toHaveProperty('representationId', testRepId);
		});
	});
});
