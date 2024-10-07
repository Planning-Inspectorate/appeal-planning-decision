const supertest = require('supertest');
const app = require('../../../../../app');
const { createPrismaClient } = require('../../../../../db/db-client');
const { seedStaticData } = require('@pins/database/src/seed/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
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
describe('/appeal-cases/{caseReference}/appeal-statements', () => {
	it('should retrieve an LPA statement for the given case reference', async () => {
		const testCaseRef = '1234123';
		await createAppeal(testCaseRef);

		await sqlClient.appealStatement.create({
			data: {
				caseReference: testCaseRef,
				lpaCode: validLpa,
				statement: 'This is the LPA statement',
				submittedDate: new Date()
			}
		});
		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/appeal-statements?type=lpa`
		);
		expect(response.status).toEqual(200);
		expect(response.body[0]).toMatchObject({
			caseReference: testCaseRef,
			lpaCode: validLpa,
			statement: 'This is the LPA statement'
		});
	});
	it('should retrieve multiple Rule 6 party statements for the given case reference', async () => {
		const testCaseRef = '1234124';
		await createAppeal(testCaseRef);

		const rule6PartyId1 = 'rule6party1';
		const rule6PartyId2 = 'rule6party2';
		await sqlClient.appealStatement.createMany({
			data: [
				{
					caseReference: testCaseRef,
					serviceUserId: rule6PartyId1,
					statement: 'This is the first Rule 6 statement',
					submittedDate: new Date()
				},
				{
					caseReference: testCaseRef,
					serviceUserId: rule6PartyId2,
					statement: 'This is the second Rule 6 statement',
					submittedDate: new Date()
				}
			]
		});
		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/appeal-statements?type=rule6`
		);
		expect(response.status).toEqual(200);
		expect(response.body.length).toBe(2);
		expect(response.body).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					caseReference: testCaseRef,
					serviceUserId: rule6PartyId1,
					statement: 'This is the first Rule 6 statement'
				}),
				expect.objectContaining({
					caseReference: testCaseRef,
					serviceUserId: rule6PartyId2,
					statement: 'This is the second Rule 6 statement'
				})
			])
		);
	});
	it('should return 404 if no LPA statement is found for the given case reference', async () => {
		const testCaseRef = '1234125';
		await createAppeal(testCaseRef);
		const invalidCaseRef = '1000000';
		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${invalidCaseRef}/appeal-statements?type=lpa`
		);
		expect(response.status).toEqual(404);
		expect(response.body).toMatchObject({
			errors: ['No LPA statement found for this case reference']
		});
	});
	it('should return 404 if no Rule 6 party statements are found for the given case reference', async () => {
		const testCaseRef = '1234126';
		await createAppeal(testCaseRef);
		const invalidCaseRef = '1000000';
		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${invalidCaseRef}/appeal-statements?type=rule6`
		);
		expect(response.status).toEqual(404);
		expect(response.body).toMatchObject({
			errors: ['No Rule 6 party statements found for this case reference']
		});
	});
});
