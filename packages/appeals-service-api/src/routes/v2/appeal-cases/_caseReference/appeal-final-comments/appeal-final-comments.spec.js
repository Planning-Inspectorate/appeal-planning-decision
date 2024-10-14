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
			AppealCase: true,
			Users: true
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
describe('/appeal-cases/{caseReference}/appeal-final-comments', () => {
	it('should retrieve LPA final comments for the given case reference', async () => {
		const testCaseRef = '5678567';
		await createAppeal(testCaseRef);
		await sqlClient.appealFinalComment.create({
			data: {
				caseReference: testCaseRef,
				lpaCode: validLpa,
				wantsFinalComment: true,
				comments: 'This is the LPA final comment',
				submittedDate: new Date()
			}
		});
		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/appeal-final-comments?type=LPAUser`
		);
		expect(response.status).toEqual(200);
		expect(response.body[0]).toMatchObject({
			caseReference: testCaseRef,
			lpaCode: validLpa,
			comments: 'This is the LPA final comment'
		});
	});
	it('should retrieve appellant final comments for the given case reference', async () => {
		const testCaseRef = '7654321';

		const serviceUser = await sqlClient.serviceUser.create({
			data: {
				id: crypto.randomUUID(),
				internalId: validUser,
				emailAddress: 'test@exmaple.com',
				serviceUserType: APPEAL_USER_ROLES.APPELLANT,
				caseReference: testCaseRef
			}
		});

		await createAppeal(testCaseRef);

		await sqlClient.appealFinalComment.create({
			data: {
				caseReference: testCaseRef,
				wantsFinalComment: true,
				comments: 'This is the appellant final comment',
				submittedDate: new Date(),
				serviceUserId: serviceUser.internalId
			}
		});

		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/appeal-final-comments?type=Appellant`
		);

		expect(response.status).toEqual(200);
		expect(response.body[0]).toMatchObject({
			caseReference: testCaseRef,
			serviceUserId: serviceUser.internalId,
			comments: 'This is the appellant final comment'
		});
	});
	it('should return 404 if no LPA final comments are found for the given case reference', async () => {
		const testCaseRef = '5678569';
		await createAppeal(testCaseRef);
		const invalidCaseRef = '1000000';
		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${invalidCaseRef}/appeal-final-comments?type=LPAUser`
		);
		expect(response.status).toEqual(404);
		expect(response.body).toMatchObject({
			errors: ['No LPAUser final comments found for this case reference']
		});
	});
	it('should return 404 if no appellant final comments are found for the given case reference', async () => {
		const testCaseRef = '5678570';
		await createAppeal(testCaseRef);
		const invalidCaseRef = '1000000';
		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${invalidCaseRef}/appeal-final-comments?type=Appellant`
		);
		expect(response.status).toEqual(404);
		expect(response.body).toMatchObject({
			errors: ['No Appellant final comments found for this case reference']
		});
	});
});
