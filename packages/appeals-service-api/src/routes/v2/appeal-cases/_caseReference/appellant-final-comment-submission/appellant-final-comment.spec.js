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
 * @returns {Promise<string|undefined>}
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

describe('/appeal-cases/_caseReference/appellant-final-comment-submission', () => {
	it('should create a new appellant final comment', async () => {
		const testCaseRef = '4639966';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const appellantFinalCommentData = {
			appellantFinalComment: true,
			appellantFinalCommentDetails: 'This is a test comment',
			appellantFinalCommentDocuments: false
		};

		const createResponse = await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-final-comment-submission`)
			.send(appellantFinalCommentData);

		expect(createResponse.status).toEqual(200);
		expect(createResponse.body).toMatchObject(appellantFinalCommentData);
	});

	it('should retrieve an existing appellant final comment', async () => {
		const testCaseRef = '4639967';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const appellantFinalCommentData = {
			appellantFinalComment: true,
			appellantFinalCommentDetails: 'This is another test comment',
			appellantFinalCommentDocuments: false
		};

		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-final-comment-submission`)
			.send(appellantFinalCommentData);

		const response = await appealsApi.get(
			`/api/v2/appeal-cases/${testCaseRef}/appellant-final-comment-submission`
		);

		expect(response.status).toEqual(200);
		expect(response.body).toMatchObject({
			...appellantFinalCommentData,
			caseReference: testCaseRef
		});
	});

	it('should patch/ update an existing appellant final comment', async () => {
		const testCaseRef = '4639968';
		await createAppeal(testCaseRef);

		const { setCurrentLpa } = require('@pins/common/src/middleware/validate-token');
		setCurrentLpa(validLpa);
		const { setCurrentSub } = require('express-oauth2-jwt-bearer');
		setCurrentSub(validUser);

		const originalComment = {
			appellantFinalComment: true,
			appellantFinalCommentDetails: 'This is yet another test comment'
		};

		await appealsApi
			.post(`/api/v2/appeal-cases/${testCaseRef}/appellant-final-comment-submission`)
			.send(originalComment);

		const updatedComment = {
			appellantFinalComment: true,
			appellantFinalCommentDetails: 'This is what I meant to say',
			appellantFinalCommentDocuments: true
		};

		const updatedResponse = await appealsApi
			.patch(`/api/v2/appeal-cases/${testCaseRef}/appellant-final-comment-submission`)
			.send(updatedComment);

		expect(updatedResponse.status).toEqual(200);
		expect(updatedResponse.body).toMatchObject({
			...updatedComment,
			caseReference: testCaseRef
		});
	});
});
